import { Shield, AlertTriangle } from 'lucide-react';
import { Document } from '../types';
import { useLanguage } from '../../../core/registry';

const ScannedDocumentWrapper = ({ children, seed = 0, type }: { children: React.ReactNode, seed: number, type: string }) => {
    const rotate = (seed % 3) - 1.5;
    const brightness = 95 + (seed % 10);
    const contrast = 90 + (seed % 15);

    const paperStyles: { [key: string]: string } = {
        identity: "max-w-md mx-auto rounded-xl shadow-xl overflow-hidden",
        newspaper: "max-w-2xl mx-auto bg-[#f4f1ea] shadow-2xl p-0",
        mission: "max-w-2xl mx-auto bg-[#fffdf5] shadow-[0_5px_15px_rgba(0,0,0,0.3)] p-8",
        certificate: "max-w-3xl mx-auto bg-[#fffaf0] shadow-lg p-1 border-[16px] border-[#fffaf0]",
        intel: "max-w-2xl mx-auto bg-[#f0f0f0] shadow-lg p-8 border-t-8 border-gray-800",
        transcript: "max-w-2xl mx-auto bg-white shadow-md p-8",
    };

    return (
        <div
            className={`relative transition-transform duration-500 ${paperStyles[type] || "bg-white p-8 max-w-xl mx-auto"}`}
            style={{
                transform: `rotate(${rotate}deg)`,
                filter: `brightness(${brightness}%) contrast(${contrast}%) sepia(0.1)`,
            }}
        >
            {/* Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] mix-blend-multiply z-20"></div>
            <div className="absolute inset-0 pointer-events-none mix-blend-multiply z-10"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.05) 100%)' }}>
            </div>

            {children}
        </div>
    );
};

// --- Sub-Renderers ---

const IDCardRenderer = ({ data, meta }: Document) => {
    const { t } = useLanguage();
    return (
        <ScannedDocumentWrapper type="identity" seed={data.surname.length}>
            <div className="bg-white relative flex flex-row h-64 border border-gray-300 text-black">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '10px 10px'
                }}></div>

                {/* Header Stripe */}
                <div className="absolute top-4 left-0 w-full h-8 bg-blue-900 z-0 opacity-90"></div>

                {/* Left Photo Section */}
                <div className="w-1/3 z-10 p-4 flex flex-col justify-center items-center relative">
                    <div className="w-24 h-32 bg-gray-200 border-2 border-gray-400 overflow-hidden relative shadow-inner">
                        <img src={data.photoUrl} alt="ID" className="w-full h-full object-cover grayscale contrast-125" />
                        {/* Hologram fake effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent w-[200%] animate-pulse transform -translate-x-1/2"></div>
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-gray-500 tracking-widest text-center uppercase">
                        {meta.agency}
                    </div>
                </div>

                {/* Right Info Section */}
                <div className="w-2/3 z-10 pt-16 pr-4 pl-2 flex flex-col">
                    <h2 className="text-2xl font-black text-gray-800 uppercase leading-none tracking-tight">
                        {data.surname},
                    </h2>
                    <h3 className="text-lg font-semibold text-gray-600 uppercase mb-2">
                        {data.firstname}
                    </h3>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono text-gray-700 mt-2">
                        <div>
                            <span className="block text-[8px] text-gray-400 uppercase">{t('dir.doc.id_no')}</span>
                            <span className="font-bold">{data.idNumber}</span>
                        </div>
                        <div>
                            <span className="block text-[8px] text-gray-400 uppercase">{t('dir.doc.dob')}</span>
                            <span className="font-bold">{data.dob}</span>
                        </div>
                        <div>
                            <span className="block text-[8px] text-gray-400 uppercase">{t('dir.doc.clearance')}</span>
                            <span className="font-bold text-red-700 border border-red-200 px-1 bg-red-50">{meta.clearance}</span>
                        </div>
                        <div>
                            <span className="block text-[8px] text-gray-400 uppercase">{t('dir.doc.sex_height')}</span>
                            <span className="font-bold">{data.sex} / {data.height}</span>
                        </div>
                    </div>

                    <div className="mt-auto mb-2 border-t border-gray-300 pt-1">
                        <span className="font-script text-xl text-blue-900 opacity-80 rotate-[-5deg] block">
                            {data.signature}
                        </span>
                    </div>
                </div>

                {/* Barcode Strip */}
                <div className="absolute bottom-2 right-4 w-32 h-6 bg-black flex items-center justify-center overflow-hidden">
                    <div className="w-full text-white text-[8px] tracking-[3px] text-center whitespace-nowrap">
                        ||| || | ||| || ||||
                    </div>
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const NewspaperRenderer = ({ data, meta }: Document) => {
    const { t } = useLanguage();
    return (
        <ScannedDocumentWrapper type="newspaper" seed={data.headline.length}>
            <div className="p-8 text-black font-serif">
                <div className="border-b-4 border-black mb-4 pb-2 flex justify-between items-end">
                    <div className="text-xs font-bold uppercase tracking-widest">{meta.date}</div>
                    <div className="text-4xl font-black uppercase font-serif tracking-tighter mx-4">{meta.paperName}</div>
                    <div className="text-xs font-bold uppercase tracking-widest">{meta.price} | {meta.vol}</div>
                </div>

                <div className="border-b border-black mb-6"></div>

                <h1 className="text-5xl md:text-6xl font-black leading-none mb-4 text-center font-serif uppercase tracking-tight">
                    {data.headline}
                </h1>
                <h2 className="text-xl md:text-2xl font-semibold text-center mb-8 italic font-serif text-gray-800">
                    {data.subhead}
                </h2>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        {data.leadImage && (
                            <div className="mb-4 bg-gray-200 p-1 border border-gray-400">
                                <img src={data.leadImage} className="w-full h-48 object-cover grayscale contrast-125 brightness-90" alt="News" />
                                <div className="text-[10px] mt-1 text-gray-600 font-sans">{data.imageCaption}</div>
                            </div>
                        )}
                        {data.columns.map((para: string, i: number) => (
                            <p key={i} className="mb-4 text-justify text-sm leading-relaxed font-serif text-gray-900 drop-shadow-sm">
                                <span className="float-left text-3xl font-bold mr-1 leading-none mt-1">{i === 0 ? para[0] : ''}</span>
                                {i === 0 ? para.substring(1) : para}
                            </p>
                        ))}
                    </div>

                    {/* Sidebar Column */}
                    <div className="w-full md:w-1/3 border-l-2 border-gray-300 pl-4">
                        <div className="bg-gray-100 p-4 border border-gray-300 mb-4">
                            <h4 className="font-bold text-sm uppercase mb-2 border-b border-gray-400 pb-1">{data.sidebar.title}</h4>
                            <p className="text-xs leading-normal">{data.sidebar.content}</p>
                        </div>
                        <div className="h-32 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] border border-gray-300 flex items-center justify-center">
                            <span className="text-[10px] uppercase font-bold text-gray-400 rotate-45">{t('dir.doc.ad_space')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const MissionRenderer = ({ data, meta }: Document) => {
    const { t } = useLanguage();
    return (
        <ScannedDocumentWrapper type="mission" seed={data.operation.length}>
            <div className="font-mono text-gray-800 relative h-full">
                {/* Stamp */}
                <div className="absolute top-0 right-0 border-4 border-red-700 text-red-700 px-4 py-2 font-black text-xl uppercase rotate-[-12deg] opacity-70 mask-image: url(https://www.transparenttextures.com/patterns/grunge-wall.png)">
                    {meta.classification}
                </div>

                <div className="mb-8">
                    <div className="text-xs uppercase tracking-[0.2em] mb-1 text-gray-500">{t('dir.doc.dept_defense')}</div>
                    <div className="w-full h-px bg-black mb-1"></div>
                    <div className="flex justify-between text-xs text-gray-600 font-bold">
                        <span>{t('dir.doc.copy')} {meta.copy}</span>
                        <span>{t('dir.doc.date')}: {meta.date}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-24 font-bold uppercase text-sm border-r-2 border-gray-300 pr-2 pt-1 text-right">{t('dir.doc.operation')}</div>
                        <div className="text-2xl font-bold tracking-widest uppercase bg-black text-white px-2 font-typewriter">
                            {data.operation}
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-24 font-bold uppercase text-sm border-r-2 border-gray-300 pr-2 pt-1 text-right">{t('dir.doc.target')}</div>
                        <div className="flex-1 text-lg uppercase font-bold underline decoration-dotted underline-offset-4">
                            {data.target}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 mt-6">
                        <div className="flex-1">
                            <div className="font-bold uppercase text-sm mb-2 border-b border-gray-300 inline-block">{t('dir.doc.briefing')}</div>
                            <p className="text-sm leading-loose font-medium text-justify font-typewriter">
                                {data.briefing}
                            </p>
                        </div>
                        {data.intel_photo && (
                            <div className="w-32 shrink-0">
                                <div className="p-1 bg-white shadow-md rotate-2 border border-gray-200">
                                    <img src={data.intel_photo} className="w-full h-auto grayscale brightness-90 contrast-125" alt="Intel" />
                                    <div className="text-[8px] text-center mt-1 text-red-600 font-bold">{t('dir.doc.fig')}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 p-4 bg-gray-100 border-l-4 border-black">
                        <div className="font-bold uppercase text-xs mb-2">{t('dir.doc.auth_assets')}</div>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            {data.assets.map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <div className="inline-block border-t border-black pt-2 w-48">
                        <div className="font-script text-2xl text-blue-900 -mt-8 mb-2 ml-4 rotate-[-5deg]">{t('dir.doc.gen_ross')}</div>
                        <div className="text-[10px] uppercase font-bold tracking-wider">{t('dir.doc.co')}</div>
                    </div>
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const CertificateRenderer = ({ data, meta }: Document) => {
    const { t } = useLanguage();
    const accentColor = meta.colorTheme || "#1a365d";

    return (
        <ScannedDocumentWrapper type="certificate" seed={data.recipient.length}>
            <div className="border-[2px] border-double border-gray-400 p-2 h-full text-black">
                <div className="border-[1px] border-gray-300 p-8 h-full flex flex-col items-center text-center relative bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">

                    {/* Ornate Header */}
                    <div className="mb-8 relative">
                        <Shield size={64} style={{ color: accentColor }} className="mx-auto opacity-20 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2" />
                        <div className="relative font-serif text-sm tracking-[0.4em] uppercase font-bold text-gray-500 mb-4 mt-8">{t('dir.doc.official_cred')}</div>
                        <h1 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-widest text-gray-900 border-b-2 pb-4 px-8" style={{ borderColor: accentColor }}>
                            {data.header}
                        </h1>
                    </div>

                    {/* Recipient */}
                    <div className="my-8 w-full">
                        <div className="text-gray-500 italic font-serif mb-4">{t('dir.doc.certifies')}</div>
                        <div className="text-3xl md:text-4xl font-script text-gray-800 mb-4 px-4 py-2 relative inline-block">
                            {data.recipient}
                            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                        </div>
                        <div className="text-gray-500 italic font-serif mt-2">{t('dir.doc.completed')}</div>
                    </div>

                    {/* Body */}
                    <p className="max-w-lg text-lg font-serif text-gray-700 leading-relaxed italic">
                        "{data.body}"
                    </p>

                    {/* Footer / Seals */}
                    <div className="mt-auto w-full pt-16 flex justify-between items-end px-4 md:px-12">
                        <div className="text-center">
                            <div className="text-xs uppercase font-bold text-gray-400 mb-1">{meta.issued}</div>
                            <div className="w-24 h-24 rounded-full border-4 border-double flex items-center justify-center relative shadow-sm" style={{ borderColor: accentColor, color: accentColor }}>
                                <div className="text-[10px] font-bold text-center leading-tight">OFFICIAL<br />SEAL<br />VERIFIED</div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="font-script text-3xl mb-1 text-gray-800 transform -rotate-6">{data.signature}</div>
                            <div className="w-48 border-t border-gray-400 pt-1 text-xs uppercase tracking-widest text-gray-500">{t('dir.doc.auth_sig')}</div>
                        </div>
                    </div>

                    {/* Reference ID small */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[8px] text-gray-300 font-mono">
                        {t('dir.doc.ref')} {meta.id}
                    </div>

                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const IntelRenderer = ({ data, meta }: Document) => {
    return (
        <ScannedDocumentWrapper type="intel" seed={data.content.length}>
            <div className="font-mono text-sm text-gray-800 relative h-full">
                {/* Header */}
                <div className="border-b-2 border-gray-800 pb-4 mb-6 flex justify-between items-end">
                    <div>
                        <div className="text-xs uppercase font-bold tracking-widest text-gray-500">INTERCEPTED TRANSMISSION</div>
                        <div className="text-xl font-black uppercase tracking-tighter">SIGNAL LOG</div>
                    </div>
                    <div className="text-right text-xs">
                        <div><span className="font-bold">DATE:</span> {meta.date}</div>
                        <div><span className="font-bold">SOURCE:</span> {meta.source}</div>
                    </div>
                </div>

                {/* Body */}
                <div className="bg-gray-200 p-4 border border-gray-300 font-typewriter whitespace-pre-wrap leading-relaxed">
                    {data.content}
                </div>

                {/* Footer */}
                <div className="mt-8 text-[10px] text-center text-gray-400 uppercase tracking-widest">
                    /// END OF TRANSMISSION ///
                </div>

                {/* Stamp */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-red-500 text-red-500 px-8 py-4 font-black text-4xl uppercase -rotate-12 opacity-20 pointer-events-none">
                    CONFIDENTIAL
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const TranscriptRenderer = ({ data, meta }: Document) => {
    return (
        <ScannedDocumentWrapper type="transcript" seed={meta.caseId?.length || 0}>
            <div className="font-sans text-gray-900 h-full">
                {/* Header */}
                <div className="text-center mb-8 border-b border-gray-300 pb-4">
                    <h1 className="text-2xl font-bold uppercase tracking-wide mb-1">Official Transcript</h1>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Case ID: {meta.caseId}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Date: {meta.date}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Participants: {meta.participants}</div>
                </div>

                {/* Content */}
                <div className="space-y-4 font-mono text-sm">
                    {data.lines.map((line: any, i: number) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-20 shrink-0 text-gray-400 text-xs pt-1 text-right">{line.timestamp}</div>
                            <div className="flex-1">
                                <span className="font-bold uppercase text-gray-700 mr-2">{line.speaker}:</span>
                                <span className="text-gray-900">{line.text}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-12 border-t border-gray-300 pt-2 flex justify-between text-[10px] text-gray-400 uppercase">
                    <div>Page 1 of 1</div>
                    <div>Verified by: SYSTEM</div>
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

export const DocumentViewer = ({ document, onClose }: { document: Document, onClose: () => void }) => {
    const { t } = useLanguage();
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-red-900/80 transition-colors"
                >
                    ✕
                </button>

                {document.type === 'identity' && <IDCardRenderer {...document} />}
                {document.type === 'newspaper' && <NewspaperRenderer {...document} />}
                {document.type === 'mission' && <MissionRenderer {...document} />}
                {document.type === 'certificate' && <CertificateRenderer {...document} />}
                {document.type === 'intel' && <IntelRenderer {...document} />}
                {document.type === 'transcript' && <TranscriptRenderer {...document} />}

                {!['identity', 'newspaper', 'mission', 'certificate', 'intel', 'transcript'].includes(document.type) && (
                    <div className="border border-red-500 p-8 text-center text-red-500 bg-black">
                        <AlertTriangle className="mx-auto mb-4" size={48} />
                        {t('dir.unknown_format')}
                    </div>
                )}
            </div>
        </div>
    );
};
