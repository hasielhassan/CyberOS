import { useState, useEffect, useRef } from 'react';

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
    const [history, setHistory] = useState(['Welcome to CyberOS v9.0', 'Type "help" for commands.']);
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
        const arg = args[1];

        const prompt = sshSession ? `root@${sshSession.domain}:${path}#` : `${path}>`;
        setHistory(h => [...h, `${prompt} ${cmd}`]);

        switch (command) {
            case 'help':
                setHistory(h => [...h, 'Commands: ls, cd, cat, mkdir, nano, rm, clear, ssh, exit']);
                break;
            case 'ssh':
                if (sshSession) {
                    setHistory(h => [...h, 'Error: Nested SSH sessions are not supported.']);
                    return;
                }
                if (!arg) {
                    setHistory(h => [...h, 'Usage: ssh <domain|ip>']);
                    return;
                }

                const hosts = JSON.parse(localStorage.getItem('cyberos_captured_hosts') || '[]');
                const targetHostIndex = hosts.findIndex((h: any) => h.domain === arg || h.ip === arg);

                if (targetHostIndex === -1) {
                    setHistory(h => [...h, `ssh: Could not resolve hostname ${arg}: Name or service not known`]);
                    return;
                }

                const host = hosts[targetHostIndex];
                setHistory(h => [...h, `Connecting to ${host.domain} (${host.ip})...`]);

                setTimeout(() => {
                    setHistory(h => [...h, `Authenticating using stored key: ${host.sshKey}...`]);
                    setTimeout(() => {
                        setHistory(h => [...h, 'Access Granted.', `Welcome to ${host.systemName || host.domain}`]);
                        setSshSession({ index: targetHostIndex, domain: host.domain, ip: host.ip, user: 'root' });
                        setFiles(host.fileSystem || { '/': { type: 'dir', children: [] } });
                        setPath('/');
                    }, 800);
                }, 600);
                break;
            case 'exit':
                if (sshSession) {
                    setHistory(h => [...h, `Connection to ${sshSession.domain} closed.`]);
                    setSshSession(null);
                    // Reload local files
                    const saved = localStorage.getItem('cyber_fs');
                    setFiles(saved ? JSON.parse(saved) : initialFileSystem);
                    setPath('/');
                } else {
                    setHistory(h => [...h, 'Logout: Session terminated.']);
                }
                break;
            case 'ls':
                // @ts-ignore
                const dir = files[path];
                if (dir && dir.type === 'dir') {
                    setHistory(h => [...h, dir.children.join('  ')]);
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
                    setHistory(h => [...h, `Directory not found: ${arg}`]);
                }
                break;
            case 'nano':
                if (!arg) { setHistory(h => [...h, 'Usage: nano <filename>']); return; }
                const filePath = resolvePath(arg);
                // @ts-ignore
                const file = files[filePath];
                if (file && file.type === 'dir') {
                    setHistory(h => [...h, `Cannot edit directory: ${arg}`]);
                } else {
                    // @ts-ignore
                    setEditor({ active: true, file: filePath, content: file ? file.content : '' });
                }
                break;
            case 'mkdir':
                if (!arg) return;
                const mkPath = resolvePath(arg);
                setFiles((prev: any) => ({
                    ...prev,
                    [mkPath]: { type: 'dir', children: [] },
                    [path]: { ...prev[path], children: [...prev[path].children, arg] }
                }));
                setHistory(h => [...h, `Created directory: ${arg}`]);
                break;
            case 'rm':
                if (!arg) return;
                const rmPath = resolvePath(arg);
                // @ts-ignore
                if (!files[rmPath]) {
                    setHistory(h => [...h, `File not found: ${arg}`]);
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
                setHistory(h => [...h, `Removed: ${arg}`]);
                break;
            case 'cat':
                if (!arg) return;
                const catPath = resolvePath(arg);
                // @ts-ignore
                const catFile = files[catPath];
                if (catFile && catFile.type === 'file') {
                    setHistory(h => [...h, catFile.content]);
                } else {
                    setHistory(h => [...h, `File not found: ${arg}`]);
                }
                break;
            case 'clear':
                setHistory([]);
                break;
            default:
                setHistory(h => [...h, `Command not found: ${command}`]);
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
        setHistory(h => [...h, `Saved file: ${editor.file}`]);
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
