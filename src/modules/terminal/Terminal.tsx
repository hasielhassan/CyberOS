import { useState, useEffect, useRef } from 'react';
import { getIpInfo, simulateTraceroute, formatIpInfo } from '../../utils/ipUtils';
import { useMissions } from '../missions/MissionsContext';
import { missionEventBus } from '../missions/MissionEventBus';
import { useLanguage } from '../../core/registry';

const initialFileSystem = {
    '/': { type: 'dir', children: ['home', 'bin', 'var', 'missions'] },
    '/home': { type: 'dir', children: ['user'] },
    '/home/user': { type: 'dir', children: ['notes.txt', 'todo.list', 'secret.key'] },
    '/bin': { type: 'dir', children: ['crack', 'trace', 'nuke'] },
    '/missions': { type: 'dir', children: ['operation_blackout.doc', 'target_list.csv'] },
    '/home/user/notes.txt': { type: 'file', content: 'Target acquired at sector 7G.\nNeed to decrypt the payload by midnight.' },
    '/home/user/todo.list': { type: 'file', content: '- Buy milk\n- Topple government\n- Feed the cat' },
    '/home/user/secret.key': { type: 'file', content: 'A77-F99-X22' },
    '/missions/operation_blackout.doc': { type: 'file', content: 'MISSION: BLACKOUT\nOBJ: Disable power grid in sector 4.\nREWARD: 5000 BTC' }
};

const TerminalConsole = () => {
    const { t } = useLanguage();
    const { activeMission } = useMissions();
    const [history, setHistory] = useState([t('term.welcome'), t('term.help_prompt')]);
    const [input, setInput] = useState('');
    const [path, setPath] = useState('/');
    const [files, setFiles] = useState(() => {
        const saved = localStorage.getItem('cyber_fs');
        return saved ? JSON.parse(saved) : initialFileSystem;
    });
    const [editor, setEditor] = useState({ active: false, file: null, content: '' });
    const [sshSession, setSshSession] = useState<{ index: number, domain: string, ip: string, user: string } | null>(null);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sshSession) {
            // Save to remote host in captured_hosts
            const captured = JSON.parse(localStorage.getItem('cyberos_captured_hosts') || '[]');
            if (captured[sshSession.index]) {
                captured[sshSession.index].fileSystem = files;
                localStorage.setItem('cyberos_captured_hosts', JSON.stringify(captured));
            }
        } else {
            // Save to local cyber_fs
            localStorage.setItem('cyber_fs', JSON.stringify(files));
        }
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [files, history, sshSession]);

    const resolvePath = (target: string) => {
        if (target.startsWith('/')) return target;
        return path === '/' ? `/${target}` : `${path}/${target}`;
    };

    const runCommand = (cmd: string) => {
        const args = cmd.split(' ');
        const command = args[0].toLowerCase();
        const arg = args[1]?.trim();
        const arg2 = args[2]?.trim();

        const prompt = sshSession ? `root@${sshSession.domain}:${path}#` : `${path}>`;
        setHistory(h => [...h, `${prompt} ${cmd}`]);

        switch (command) {
            case 'help':
                setHistory(h => [
                    ...h,
                    t('term.help_header'),
                    t('term.help_ls'),
                    t('term.help_cd'),
                    t('term.help_pwd'),
                    t('term.help_mkdir'),
                    t('term.help_rmdir'),
                    t('term.help_touch'),
                    t('term.help_mv'),
                    t('term.help_rm'),
                    t('term.help_cat'),
                    t('term.help_nano'),
                    t('term.help_search'),
                    t('term.help_ipinfo'),
                    t('term.help_trace'),
                    t('term.help_clear'),
                    t('term.help_ssh'),
                    t('term.help_exit')
                ]);
                break;
            case 'search':
                if (!arg) { setHistory(h => [...h, t('term.usage_search')]); return; }
                const term = arg.toLowerCase();
                const results: string[] = [];

                Object.entries(files).forEach(([filePath, data]: [string, any]) => {
                    const nameMatch = filePath.toLowerCase().includes(term);
                    const contentMatch = data.type === 'file' && data.content.toLowerCase().includes(term);

                    if (nameMatch) {
                        results.push(`[${data.type === 'dir' ? 'DIR' : 'FILE'}] ${filePath}`);
                    }

                    if (contentMatch) {
                        const lines = data.content.split('\n');
                        lines.forEach((line: string) => {
                            if (line.toLowerCase().includes(term)) {
                                results.push(`[MATCH] ${filePath}: ...${line.trim()}...`);
                            }
                        });
                    }
                });

                if (results.length === 0) {
                    setHistory(h => [...h, t('term.no_matches', { term: arg })]);
                } else {
                    setHistory(h => [...h, t('term.search_results', { term: arg }), ...results]);
                }
                break;
            case 'pwd':
                setHistory(h => [...h, path]);
                break;
            case 'ls':
                // @ts-ignore
                const dir = files[path];
                if (dir && dir.type === 'dir') {
                    setHistory(h => [...h, dir.children.length > 0 ? dir.children.join('  ') : '(empty)']);
                }
                break;
            case 'cd':
                if (!arg || arg === '/') { setPath('/'); return; }
                if (arg === '..') {
                    const parts = path.split('/');
                    parts.pop();
                    setPath(parts.length === 1 ? '/' : parts.join('/'));
                    return;
                }
                const newPath = resolvePath(arg);
                // @ts-ignore
                if (files[newPath] && files[newPath].type === 'dir') {
                    setPath(newPath);
                } else {
                    setHistory(h => [...h, t('term.dir_not_found', { dir: arg })]);
                }
                break;
            case 'touch':
                if (!arg) { setHistory(h => [...h, t('term.usage_touch')]); return; }
                const touchPath = resolvePath(arg);
                // @ts-ignore
                if (files[touchPath]) {
                    setHistory(h => [...h, t('term.updated_timestamp', { file: arg })]);
                } else {
                    setFiles((prev: any) => {
                        const parentDir = touchPath.substring(0, touchPath.lastIndexOf('/')) || '/';
                        const fileName = touchPath.split('/').pop();
                        if (!prev[parentDir]) return prev;

                        const newFiles = { ...prev, [touchPath]: { type: 'file', content: '' } };
                        newFiles[parentDir] = { ...prev[parentDir], children: [...prev[parentDir].children, fileName] };
                        return newFiles;
                    });
                    setHistory(h => [...h, t('term.created_file', { file: arg })]);
                }
                break;
            case 'mkdir':
                if (!arg) { setHistory(h => [...h, t('term.usage_mkdir')]); return; }
                const mkPath = resolvePath(arg);
                // @ts-ignore
                if (files[mkPath]) {
                    setHistory(h => [...h, t('term.error_exists', { name: arg })]);
                    return;
                }
                setFiles((prev: any) => ({
                    ...prev,
                    [mkPath]: { type: 'dir', children: [] },
                    [path]: { ...prev[path], children: [...prev[path].children, arg] }
                }));
                setHistory(h => [...h, t('term.created_dir', { dir: arg })]);
                break;
            case 'rmdir':
                if (!arg) { setHistory(h => [...h, t('term.usage_rmdir')]); return; }
                const rmdirPath = resolvePath(arg);
                // @ts-ignore
                const targetDir = files[rmdirPath];
                if (!targetDir) {
                    setHistory(h => [...h, t('term.dir_not_found', { dir: arg })]);
                } else if (targetDir.type !== 'dir') {
                    setHistory(h => [...h, t('term.not_a_dir', { name: arg })]);
                } else if (targetDir.children.length > 0) {
                    setHistory(h => [...h, t('term.dir_not_empty', { name: arg })]);
                } else {
                    setFiles((prev: any) => {
                        const newFiles = { ...prev };
                        delete newFiles[rmdirPath];
                        const parent = rmdirPath.substring(0, rmdirPath.lastIndexOf('/')) || '/';
                        if (newFiles[parent]) {
                            newFiles[parent] = {
                                ...newFiles[parent],
                                children: newFiles[parent].children.filter((c: string) => c !== arg)
                            };
                        }
                        return newFiles;
                    });
                    setHistory(h => [...h, t('term.removed_dir', { dir: arg })]);
                }
                break;
            case 'mv':
                if (!arg || !arg2) { setHistory(h => [...h, t('term.usage_mv')]); return; }
                const sourcePath = resolvePath(arg);
                let destPath = resolvePath(arg2);

                // @ts-ignore
                if (!files[sourcePath]) {
                    setHistory(h => [...h, t('term.source_not_found', { src: arg })]);
                    return;
                }

                // Check if dest is a directory, if so, append filename
                // @ts-ignore
                if (files[destPath] && files[destPath].type === 'dir') {
                    destPath = `${destPath === '/' ? '' : destPath}/${arg.split('/').pop()}`;
                }

                setFiles((prev: any) => {
                    const newFiles = { ...prev };
                    const isDir = newFiles[sourcePath].type === 'dir';

                    // Move the item itself
                    newFiles[destPath] = newFiles[sourcePath];
                    delete newFiles[sourcePath];

                    // Update parent of source
                    const srcParent = sourcePath.substring(0, sourcePath.lastIndexOf('/')) || '/';
                    const srcFileName = sourcePath.split('/').pop();
                    if (newFiles[srcParent]) {
                        newFiles[srcParent] = {
                            ...newFiles[srcParent],
                            children: newFiles[srcParent].children.filter((c: string) => c !== srcFileName)
                        };
                    }

                    // Update parent of dest
                    const dstParent = destPath.substring(0, destPath.lastIndexOf('/')) || '/';
                    const dstFileName = destPath.split('/').pop();
                    if (newFiles[dstParent]) {
                        newFiles[dstParent] = {
                            ...newFiles[dstParent],
                            children: [...newFiles[dstParent].children, dstFileName]
                        };
                    }

                    // If directory, move all children (recursive in flat structure)
                    if (isDir) {
                        Object.keys(newFiles).forEach(key => {
                            if (key.startsWith(sourcePath + '/')) {
                                const newKey = destPath + key.substring(sourcePath.length);
                                newFiles[newKey] = newFiles[key];
                                delete newFiles[key];
                            }
                        });
                    }

                    return newFiles;
                });
                setHistory(h => [...h, t('term.moved', { src: arg, dest: arg2 })]);
                break;
            case 'rm':
                if (!arg) { setHistory(h => [...h, t('term.usage_rm')]); return; }
                const rmPath = resolvePath(arg);
                // @ts-ignore
                if (!files[rmPath]) {
                    setHistory(h => [...h, t('term.file_not_found', { file: arg })]);
                    return;
                }
                // @ts-ignore
                if (files[rmPath].type === 'dir') {
                    setHistory(h => [...h, t('term.cannot_rm_dir')]);
                    return;
                }
                setFiles((prev: any) => {
                    const newFiles = { ...prev };
                    delete newFiles[rmPath];
                    // Remove from parent
                    const parent = rmPath.substring(0, rmPath.lastIndexOf('/')) || '/';
                    if (newFiles[parent]) {
                        newFiles[parent] = {
                            ...newFiles[parent],
                            children: newFiles[parent].children.filter((c: string) => c !== arg)
                        };
                    }
                    return newFiles;
                });
                setHistory(h => [...h, t('term.removed', { file: arg })]);
                break;
            case 'nano':
                if (!arg) { setHistory(h => [...h, t('term.usage_nano')]); return; }
                const filePath = resolvePath(arg);
                // @ts-ignore
                const file = files[filePath];
                if (file && file.type === 'dir') {
                    setHistory(h => [...h, t('term.cannot_edit_dir', { dir: arg })]);
                } else {
                    // @ts-ignore
                    setEditor({ active: true, file: filePath, content: file ? file.content : '' });
                }
                break;
            case 'cat':
                if (!arg) { setHistory(h => [...h, t('term.usage_cat')]); return; }
                const catPath = resolvePath(arg);
                // @ts-ignore
                const catFile = files[catPath];
                if (catFile && catFile.type === 'file') {
                    setHistory(h => [...h, catFile.content]);
                    missionEventBus.emit('TERMINAL_OPEN', { target: arg });
                } else {
                    setHistory(h => [...h, t('term.file_not_found', { file: arg })]);
                }
                break;
            case 'ssh':
                if (sshSession) {
                    setHistory(h => [...h, t('term.nested_ssh_error')]);
                    return;
                }
                if (!arg) {
                    setHistory(h => [...h, t('term.usage_ssh')]);
                    return;
                }

                const hosts = JSON.parse(localStorage.getItem('cyberos_captured_hosts') || '[]');
                const targetHostIndex = hosts.findIndex((h: any) => h.domain === arg || h.ip === arg);

                if (targetHostIndex === -1) {
                    setHistory(h => [...h, t('term.ssh_resolve_error', { host: arg })]);
                    return;
                }

                const host = hosts[targetHostIndex];
                setHistory(h => [...h, t('term.connecting_to', { host: host.domain, ip: host.ip })]);

                setTimeout(() => {
                    setHistory(h => [...h, t('term.authenticating', { key: host.sshKey })]);
                    setTimeout(() => {
                        setHistory(h => [...h, t('term.access_granted'), t('term.welcome_to', { host: host.systemName || host.domain })]);
                        setSshSession({ index: targetHostIndex, domain: host.domain, ip: host.ip, user: 'root' });
                        setFiles(host.fileSystem || { '/': { type: 'dir', children: [] } });
                        setPath('/');
                        missionEventBus.emit('TERMINAL_SSH_LOGIN', { target: host.ip });
                    }, 800);
                }, 600);
                break;
            case 'exit':
                if (sshSession) {
                    setHistory(h => [...h, t('term.connection_closed', { host: sshSession.domain })]);
                    setSshSession(null);
                    // Reload local files
                    const saved = localStorage.getItem('cyber_fs');
                    setFiles(saved ? JSON.parse(saved) : initialFileSystem);
                    setPath('/');
                } else {
                    setHistory(h => [...h, t('term.logout')]);
                }
                break;
            case 'ipinfo':
                if (!arg) {
                    setHistory(h => [...h, t('term.usage_ipinfo')]);
                    setHistory(h => [...h, 'Example: ipinfo 8.8.8.8']);
                    return;
                }
                // Show loading message
                setHistory(h => [...h, t('term.querying', { ip: arg })]);

                // Check for mission-specific data
                if (activeMission && activeMission.moduleData?.Terminal?.ipdata?.[arg]) {
                    const missionIpData = activeMission.moduleData.Terminal.ipdata[arg].info;
                    const formattedInfo = formatIpInfo(missionIpData, true);
                    setTimeout(() => {
                        setHistory(h => {
                            const newHistory = [...h];
                            newHistory.pop();
                            return [...newHistory, ...formattedInfo];
                        });
                        // Emit event
                        console.log('Terminal: Emitting TERMINAL_IPINFO (Mission Data)', { target: arg });
                        missionEventBus.emit('TERMINAL_IPINFO', { target: arg });
                    }, 800); // Fake delay for realism
                    return;
                }

                // Fetch IP info asynchronously
                getIpInfo(arg).then(info => {
                    const formattedInfo = formatIpInfo(info, true);
                    setHistory(h => {
                        // Remove the "Querying..." message and add the results
                        const newHistory = [...h];
                        newHistory.pop(); // Remove loading message
                        return [...newHistory, ...formattedInfo];
                    });
                    // Emit event
                    console.log('Terminal: Emitting TERMINAL_IPINFO', { target: arg });
                    missionEventBus.emit('TERMINAL_IPINFO', { target: arg });
                }).catch(error => {
                    setHistory(h => {
                        const newHistory = [...h];
                        newHistory.pop();
                        return [...newHistory, t('term.error_ipinfo', { error: error.message })];
                    });
                });
                break;
            case 'trace':
                if (!arg) {
                    setHistory(h => [...h, t('term.usage_trace')]);
                    setHistory(h => [...h, 'Example: trace 8.8.8.8']);
                    return;
                }
                // Show loading message
                setHistory(h => [...h, t('term.tracing', { ip: arg })]);

                // Check for mission-specific data
                if (activeMission && activeMission.moduleData?.Terminal?.ipdata?.[arg]?.trace) {
                    const missionTrace = activeMission.moduleData.Terminal.ipdata[arg].trace;
                    setTimeout(() => {
                        setHistory(h => {
                            const newHistory = [...h];
                            newHistory.pop();
                            const traceOutput = [t('term.traceroute_to', { ip: arg }), ...missionTrace];
                            return [...newHistory, ...traceOutput];
                        });
                        // Emit event
                        missionEventBus.emit('TERMINAL_TRACE', { target: arg });
                    }, 1500); // Fake delay
                    return;
                }

                // Simulate traceroute asynchronously
                simulateTraceroute(arg, 8).then(route => {
                    const traceOutput: string[] = [t('term.traceroute_to', { ip: arg })];
                    route.forEach((hop, index) => {
                        const hopNum = (index + 1).toString().padStart(2, ' ');
                        const location = `${hop.city || 'Unknown'}, ${hop.country || '??'}`;
                        const org = hop.org ? ` (${hop.org.split(' ')[0]})` : '';
                        traceOutput.push(`${hopNum}. ${hop.ip.padEnd(15)} - ${location}${org}`);
                    });

                    setHistory(h => {
                        // Remove the "Tracing..." message and add the results
                        const newHistory = [...h];
                        newHistory.pop(); // Remove loading message
                        return [...newHistory, ...traceOutput];
                    });
                    // Emit event
                    missionEventBus.emit('TERMINAL_TRACE', { target: arg });
                }).catch(error => {
                    setHistory(h => {
                        const newHistory = [...h];
                        newHistory.pop();
                        return [...newHistory, t('term.error_trace', { error: error.message })];
                    });
                });
                break;
            case 'clear':
                setHistory([]);
                break;
            default:
                setHistory(h => [...h, t('term.command_not_found', { cmd: command })]);
        }
    };

    const saveFile = () => {
        setFiles((prev: any) => {
            // @ts-ignore
            const parentDir = editor.file.substring(0, editor.file.lastIndexOf('/')) || '/';
            // @ts-ignore
            const fileName = editor.file.split('/').pop();

            // Update parent if new file
            // @ts-ignore
            const newFiles = { ...prev, [editor.file]: { type: 'file', content: editor.content } };
            // @ts-ignore
            if (!prev[editor.file] && prev[parentDir]) {
                newFiles[parentDir] = { ...prev[parentDir], children: [...prev[parentDir].children, fileName] };
            }
            return newFiles;
        });
        // @ts-ignore
        setEditor({ active: false, file: null, content: '' });
        // @ts-ignore
        setHistory(h => [...h, t('term.saved_file', { file: editor.file })]);
    };

    if (editor.active) {
        return (
            <div className="h-full flex flex-col bg-gray-900 text-white font-code p-2 border border-green-500">
                <div className="flex justify-between bg-green-800 px-2 text-black">
                    <span>GNU nano 4.2</span>
                    <span>{editor.file}</span>
                </div>
                <textarea
                    className="flex-1 bg-transparent resize-none outline-none p-2"
                    value={editor.content}
                    // @ts-ignore
                    onChange={e => setEditor(prev => ({ ...prev, content: e.target.value }))}
                />
                <div className="flex gap-4 text-xs mt-2">
                    <button onClick={saveFile} className="bg-white text-black px-2">^O Write Out</button>
                    {/* @ts-ignore */}
                    <button onClick={() => setEditor({ active: false, file: null, content: '' })} className="bg-white text-black px-2">^X Exit</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col font-code text-sm p-2 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                {history.map((line, i) => (
                    <div key={i} className="text-green-400 break-words">{line}</div>
                ))}
                <div ref={endRef} />
            </div>
            <div className="flex items-center mt-2 border-t border-green-900 pt-2">
                <span className="text-green-600 mr-2">{sshSession ? `root@${sshSession.domain}:${path}#` : `${path}>`}</span>
                <input
                    className="bg-transparent border-none outline-none text-green-100 flex-1"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { runCommand(input); setInput(''); } }}
                    autoFocus
                />
            </div>
        </div>
    );
};

export default TerminalConsole;
