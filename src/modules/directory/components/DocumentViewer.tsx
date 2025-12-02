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
        blueprint: "max-w-5xl w-full h-[85vh] mx-auto bg-[#003366] shadow-xl p-8 border-4 border-white/20",
        medical_report: "max-w-2xl mx-auto bg-white shadow-md p-8 border-l-8 border-red-500",
        email_thread: "max-w-2xl mx-auto bg-white shadow-sm p-8",
        dossier: "max-w-2xl mx-auto bg-[#f0e6d2] shadow-[2px_2px_10px_rgba(0,0,0,0.3)] p-2",
        passport: "max-w-sm mx-auto bg-[#1a237e] shadow-xl rounded-lg overflow-hidden",
        map: "max-w-3xl mx-auto bg-[#fdfbf7] shadow-lg p-2",
        credential: "max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200",
        evidence: "max-w-2xl mx-auto bg-[#f8f9fa] shadow-md p-8 border-2 border-gray-300 border-dashed",
        lab_report: "max-w-2xl mx-auto bg-white shadow-md p-8",
        space_memo: "max-w-2xl mx-auto bg-[#0b0d17] text-gray-100 shadow-2xl p-8 border border-gray-700",
        patent: "max-w-2xl mx-auto bg-[#fffdf5] shadow-md p-8 border-double border-4 border-gray-300",
        finance_report: "max-w-3xl mx-auto bg-white shadow-lg p-8",
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

const BlueprintRenderer = ({ data, meta }: Document) => {
    return (
        <ScannedDocumentWrapper type="blueprint" seed={data.title?.length || 0}>
            <div className="font-mono text-blue-100 relative h-full">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                <div className="border-4 border-white/40 p-4 h-full flex flex-col">
                    <div className="flex justify-between items-start border-b-2 border-white/40 pb-4 mb-4">
                        <div>
                            <div className="text-xs uppercase opacity-70">Project Code</div>
                            <div className="text-2xl font-bold">{meta.projectCode}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs uppercase opacity-70">Revision</div>
                            <div className="text-xl font-bold">{meta.revision}</div>
                        </div>
                    </div>

                    {/* Content Section - Compact Top */}
                    <div className="mb-3 text-center border-b border-white/20 pb-3">
                        <h2 className="text-2xl font-bold uppercase tracking-[0.5em] mb-2">{data.title}</h2>
                        <p className="text-sm opacity-70 max-w-2xl mx-auto mb-2">{data.description}</p>

                        {/* Technical Specs - Inline Horizontal */}
                        <div className="flex justify-center gap-8 text-sm">
                            {data.specs && Object.entries(data.specs).map(([key, value]) => (
                                <div key={key} className="flex items-baseline gap-2">
                                    <span className="uppercase opacity-60 text-xs">{key}:</span>
                                    <span className="font-bold text-lg">{value as string}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Drawing Section - Maximum Space */}
                    <div className="flex-1 relative border border-white/20 bg-blue-900/30 mb-3 overflow-hidden min-h-0">
                        {/* Blueprint Drawing */}
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                            {data.drawingUrl ? (
                                <img
                                    src={data.drawingUrl}
                                    className="w-full h-full object-contain opacity-90 grayscale invert mix-blend-screen"
                                    alt="Blueprint"
                                />
                            ) : (
                                <div className="opacity-10">
                                    <Shield size={200} />
                                </div>
                            )}
                        </div>

                        {/* Grid Overlay on top of image for effect */}
                        <div className="absolute inset-0 pointer-events-none opacity-30"
                            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                        </div>
                    </div>

                    <div className="flex justify-between text-[10px] uppercase opacity-60">
                        <div>Authorized By: {meta.author}</div>
                        <div>Date: {meta.date}</div>
                        <div>Scale: 1:100</div>
                    </div>
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const MedicalReportRenderer = ({ data, meta }: Document) => {
    return (
        <ScannedDocumentWrapper type="medical_report" seed={data.patientName?.length || 0}>
            <div className="font-sans text-gray-800">
                <div className="flex justify-between items-center border-b-4 border-red-500 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded-full font-bold text-2xl">+</div>
                        <div>
                            <div className="text-xl font-bold uppercase tracking-tight text-gray-900">{meta.hospitalName || "General Hospital"}</div>
                            <div className="text-xs text-gray-500 uppercase">Department of {meta.department || "Medicine"}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-red-500 uppercase">Confidential</div>
                        <div className="text-xs font-mono">REF: {meta.refId}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-4 rounded border border-gray-200">
                    <div>
                        <div className="text-xs text-gray-500 uppercase">Patient Name</div>
                        <div className="font-bold text-lg">{data.patientName}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase">Date of Birth</div>
                        <div className="font-bold">{data.dob}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase">Blood Type</div>
                        <div className="font-bold">{data.bloodType}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase">Status</div>
                        <div className="font-bold text-red-600">{data.status}</div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-bold uppercase text-sm border-b border-gray-300 mb-2">Diagnosis</h3>
                    <p className="text-sm leading-relaxed">{data.diagnosis}</p>
                </div>

                <div className="mb-6">
                    <h3 className="font-bold uppercase text-sm border-b border-gray-300 mb-2">Treatment Plan</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                        {data.treatment && data.treatment.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="mt-12 flex justify-between items-end">
                    <div className="text-center">
                        <div className="font-script text-2xl mb-1">{data.doctorName}</div>
                        <div className="border-t border-gray-400 pt-1 text-xs uppercase">Attending Physician</div>
                    </div>
                    <div className="w-24 h-24 border-4 border-red-200 rounded-full flex items-center justify-center opacity-50 rotate-12">
                        <span className="text-red-300 font-black text-xs text-center">MEDICAL<br />RECORDS<br />SEAL</span>
                    </div>
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const EmailThreadRenderer = ({ data, meta }: Document) => {
    return (
        <ScannedDocumentWrapper type="email_thread" seed={data.subject?.length || 0}>
            <div className="font-sans text-sm text-gray-800">
                <div className="mb-6 border-b border-gray-300 pb-4">
                    <h1 className="text-xl font-bold mb-4">{data.subject}</h1>
                    <div className="grid grid-cols-[60px_1fr] gap-y-1">
                        <div className="text-gray-500 font-bold text-right pr-2">From:</div>
                        <div>{meta.from}</div>
                        <div className="text-gray-500 font-bold text-right pr-2">To:</div>
                        <div>{meta.to}</div>
                        <div className="text-gray-500 font-bold text-right pr-2">Date:</div>
                        <div>{meta.date}</div>
                    </div>
                </div>

                <div className="space-y-8">
                    {data.emails && data.emails.map((email: any, i: number) => (
                        <div key={i} className={`relative ${i > 0 ? 'pl-4 border-l-2 border-gray-200' : ''}`}>
                            <div className="bg-gray-100 p-2 mb-2 flex justify-between items-center text-xs text-gray-600">
                                <span className="font-bold">{email.from}</span>
                                <span>{email.timestamp}</span>
                            </div>
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {email.body}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200 text-[10px] text-gray-400">
                    Printed from CyberOS Mail Client v4.2
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const DossierRenderer = ({ data, meta }: Document) => {
    return (
        <ScannedDocumentWrapper type="dossier" seed={data.name?.length || 0}>
            <div className="relative h-full flex flex-col">
                {/* Folder Tab */}
                <div className="absolute -top-6 right-0 bg-[#e6d5a5] px-8 py-1 rounded-t-lg border-t border-x border-[#d1c090] shadow-sm">
                    <span className="font-mono font-bold text-sm text-gray-700">{meta.fileId}</span>
                </div>

                <div className="border-2 border-[#d1c090] p-6 h-full flex flex-col bg-[#fdf6e3]">
                    <div className="text-center mb-8 relative">
                        <div className="inline-block border-4 border-red-600 text-red-600 px-6 py-2 font-black text-2xl uppercase -rotate-6 opacity-80 mb-4">
                            {meta.status || "CONFIDENTIAL"}
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-widest text-gray-800 border-b-2 border-gray-800 pb-2">
                            {data.name}
                        </h1>
                    </div>

                    <div className="flex gap-6 mb-6">
                        <div className="w-32 h-40 bg-gray-300 shrink-0 border-2 border-gray-400 p-1 shadow-inner rotate-1">
                            {data.photoUrl ? (
                                <img src={data.photoUrl} className="w-full h-full object-cover grayscale" alt="Subject" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs text-center font-bold">NO PHOTO<br />AVAILABLE</div>
                            )}
                        </div>
                        <div className="flex-1 space-y-2 font-mono text-sm">
                            <div className="grid grid-cols-[100px_1fr] border-b border-gray-300 pb-1">
                                <span className="uppercase text-gray-500">Alias:</span>
                                <span className="font-bold">{data.alias}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] border-b border-gray-300 pb-1">
                                <span className="uppercase text-gray-500">DOB:</span>
                                <span className="font-bold">{data.dob}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] border-b border-gray-300 pb-1">
                                <span className="uppercase text-gray-500">Nationality:</span>
                                <span className="font-bold">{data.nationality}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] border-b border-gray-300 pb-1">
                                <span className="uppercase text-gray-500">Affiliation:</span>
                                <span className="font-bold">{data.affiliation}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold uppercase bg-black text-white px-2 py-1 text-sm mb-2">Profile Summary</h3>
                        <p className="font-typewriter text-sm leading-relaxed text-justify mb-4">
                            {data.summary}
                        </p>

                        <h3 className="font-bold uppercase bg-black text-white px-2 py-1 text-sm mb-2">Known Associates</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.associates && data.associates.map((person: string, i: number) => (
                                <span key={i} className="bg-gray-200 px-2 py-1 text-xs font-mono border border-gray-400">{person}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const PassportRenderer = ({ data, meta }: Document) => {
    return (
        <ScannedDocumentWrapper type="passport" seed={data.surname?.length || 0}>
            <div className="bg-[#1a237e] text-white p-4 h-full flex flex-col relative overflow-hidden">
                {/* Gold Foil Effect */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/gold-scale.png')]"></div>

                <div className="text-center mb-4 border-b border-yellow-500/30 pb-2">
                    <div className="text-xs uppercase tracking-[0.3em] text-yellow-500 mb-1">{meta.country || "UNITED NATIONS"}</div>
                    <div className="text-2xl font-serif font-bold text-yellow-400 tracking-widest">PASSPORT</div>
                </div>

                <div className="flex gap-4 bg-white/10 p-2 rounded backdrop-blur-sm border border-white/20">
                    <div className="w-24 h-32 bg-gray-300 shrink-0 relative overflow-hidden rounded-sm">
                        <img src={data.photoUrl} className="w-full h-full object-cover" alt="Passport" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50"></div>
                    </div>
                    <div className="flex-1 space-y-2 text-[10px] font-mono">
                        <div>
                            <div className="text-yellow-500/70 uppercase text-[8px]">Surname</div>
                            <div className="font-bold text-sm">{data.surname}</div>
                        </div>
                        <div>
                            <div className="text-yellow-500/70 uppercase text-[8px]">Given Names</div>
                            <div className="font-bold text-sm">{data.givenNames}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <div className="text-yellow-500/70 uppercase text-[8px]">Nationality</div>
                                <div className="font-bold">{data.nationality}</div>
                            </div>
                            <div>
                                <div className="text-yellow-500/70 uppercase text-[8px]">DOB</div>
                                <div className="font-bold">{data.dob}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <div className="text-yellow-500/70 uppercase text-[8px]">Sex</div>
                                <div className="font-bold">{data.sex}</div>
                            </div>
                            <div>
                                <div className="text-yellow-500/70 uppercase text-[8px]">Expires</div>
                                <div className="font-bold">{data.expiryDate}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-4 font-mono text-[10px] tracking-widest opacity-80 break-all leading-none">
                    P&lt;{data.nationality}{data.surname}&lt;&lt;{data.givenNames}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />
                    {meta.passportNumber}&lt;{data.nationality}{data.dob.replace(/-/g, '').slice(2)}&lt;{data.sex}&lt;{data.expiryDate.replace(/-/g, '').slice(2)}&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const MapRenderer = ({ data, meta }: Document) => {
    return (
        <ScannedDocumentWrapper type="map" seed={data.locationName?.length || 0}>
            <div className="relative h-full bg-[#e8e0d5] overflow-hidden border border-gray-400">
                {/* Map Grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {/* Map Image Placeholder */}
                <div className="absolute inset-0 opacity-50 mix-blend-multiply">
                    <img src={data.mapImageUrl || "https://placehold.co/800x600/e8e0d5/a09080?text=MAP+DATA"} className="w-full h-full object-cover grayscale contrast-125" alt="Map" />
                </div>

                {/* Overlay UI */}
                <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="bg-white/80 backdrop-blur-sm p-2 border border-black shadow-sm">
                            <h2 className="font-bold uppercase text-sm tracking-widest">{data.locationName}</h2>
                            <div className="text-xs font-mono">{data.coordinates}</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-1 border border-black">
                            <div className="text-[10px] font-bold uppercase">Scale 1:{meta.scale || "50000"}</div>
                        </div>
                    </div>

                    {/* Markers */}
                    <div className="absolute inset-0 pointer-events-none">
                        {data.markers && data.markers.map((marker: any, i: number) => (
                            <div key={i} className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2" style={{ left: marker.x, top: marker.y }}>
                                <div className="w-4 h-4 border-2 border-red-600 rounded-full bg-red-600/20 animate-pulse"></div>
                                <div className="mt-1 bg-black text-white text-[8px] px-1 uppercase font-bold">{marker.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-2 border border-black self-start max-w-xs">
                        <h3 className="font-bold text-xs uppercase mb-1">Tactical Notes</h3>
                        <p className="text-[10px] leading-tight">{data.notes}</p>
                    </div>
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const CredentialRenderer = ({ data, meta }: Document) => {
    return (
        <ScannedDocumentWrapper type="credential" seed={data.name?.length || 0}>
            <div className="flex h-full">
                {/* Photo Side */}
                <div className="w-1/3 bg-gray-200 relative overflow-hidden border-r border-gray-300">
                    <img src={data.photoUrl} className="w-full h-full object-cover grayscale contrast-125" alt="Credential" />
                    <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[8px] text-center py-1 uppercase tracking-widest">
                        {meta.clearanceLevel || "RESTRICTED"}
                    </div>
                </div>

                {/* Info Side */}
                <div className="flex-1 p-4 flex flex-col justify-between bg-white">
                    <div>
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                            <Shield size={24} className="text-blue-900" />
                            <div>
                                <div className="text-[8px] uppercase text-gray-500 font-bold">{meta.agency || "GOVERNMENT"}</div>
                                <div className="text-xs font-black uppercase tracking-tighter leading-none">ACCESS CARD</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <div className="text-[8px] uppercase text-gray-400 font-bold">Name</div>
                                <div className="font-bold text-sm uppercase">{data.name}</div>
                            </div>
                            <div>
                                <div className="text-[8px] uppercase text-gray-400 font-bold">Department</div>
                                <div className="font-bold text-xs uppercase">{data.department}</div>
                            </div>
                            <div>
                                <div className="text-[8px] uppercase text-gray-400 font-bold">ID Number</div>
                                <div className="font-mono text-xs">{data.idNumber}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="h-8 bg-black flex items-center justify-center overflow-hidden rounded">
                            <div className="w-full text-white text-[6px] tracking-[2px] text-center whitespace-nowrap opacity-50">
                                ||| || | ||| || |||| || |||
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const EvidenceRenderer = ({ data, meta }: Document) => {
    return (
        <ScannedDocumentWrapper type="evidence" seed={data.caseNumber?.length || 0}>
            <div className="font-sans text-gray-800 h-full flex flex-col">
                <div className="border-b-2 border-gray-800 pb-2 mb-4 flex justify-between items-end">
                    <div>
                        <div className="text-2xl font-black uppercase tracking-tighter">EVIDENCE REPORT</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Forensics Division</div>
                    </div>
                    <div className="text-right font-mono text-xs">
                        <div>CASE #: <span className="font-bold">{data.caseNumber}</span></div>
                        <div>DATE: <span className="font-bold">{meta.date}</span></div>
                    </div>
                </div>

                <div className="flex gap-6 mb-6">
                    <div className="w-1/2">
                        <div className="bg-gray-100 border border-gray-300 p-2 mb-2 relative">
                            <img src={data.imageUrl} className="w-full h-48 object-contain mix-blend-multiply" alt="Evidence" />
                            <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 uppercase border border-yellow-500 shadow-sm">
                                Exhibit {data.exhibitId}
                            </div>
                        </div>
                        <div className="text-[10px] text-gray-500 text-center italic">{data.imageCaption}</div>
                    </div>
                    <div className="w-1/2 space-y-4 text-sm">
                        <div>
                            <div className="font-bold uppercase text-xs border-b border-gray-300 mb-1">Description</div>
                            <p className="leading-tight">{data.description}</p>
                        </div>
                        <div>
                            <div className="font-bold uppercase text-xs border-b border-gray-300 mb-1">Recovered From</div>
                            <p className="leading-tight">{data.recoveredFrom}</p>
                        </div>
                        <div>
                            <div className="font-bold uppercase text-xs border-b border-gray-300 mb-1">Analysis</div>
                            <p className="leading-tight">{data.analysis}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-auto border-t border-gray-300 pt-2">
                    <h4 className="font-bold uppercase text-xs mb-2">Chain of Custody</h4>
                    <table className="w-full text-[10px] text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="pb-1">Date/Time</th>
                                <th className="pb-1">Released By</th>
                                <th className="pb-1">Received By</th>
                                <th className="pb-1">Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.chainOfCustody && data.chainOfCustody.map((entry: any, i: number) => (
                                <tr key={i} className="border-b border-gray-100">
                                    <td className="py-1">{entry.timestamp}</td>
                                    <td className="py-1">{entry.releasedBy}</td>
                                    <td className="py-1">{entry.receivedBy}</td>
                                    <td className="py-1">{entry.purpose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const LaboratoryReportRenderer = ({ data, meta }: Document) => {
    return (
        <ScannedDocumentWrapper type="lab_report" seed={data.title?.length || 0}>
            <div className="font-sans text-gray-800 h-full">
                <div className="border-b-4 border-blue-500 pb-4 mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="text-4xl text-blue-500">
                            <Shield />
                        </div>
                        <div>
                            <div className="text-2xl font-bold uppercase tracking-tight text-gray-900">Research Laboratory</div>
                            <div className="text-xs text-gray-500 uppercase">Scientific Analysis Division</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-blue-600 uppercase">Final Report</div>
                        <div className="text-xs font-mono">ID: {meta.reportId}</div>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 border border-blue-100 mb-6 rounded">
                    <h2 className="text-xl font-bold mb-2">{data.title}</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="font-bold text-gray-500">Subject:</span> {data.subject}</div>
                        <div><span className="font-bold text-gray-500">Date:</span> {meta.date}</div>
                        <div><span className="font-bold text-gray-500">Researcher:</span> {meta.researcher}</div>
                        <div><span className="font-bold text-gray-500">Clearance:</span> {meta.clearance}</div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold uppercase text-sm text-blue-800 border-b border-blue-200 mb-2">Abstract</h3>
                        <p className="text-sm leading-relaxed text-justify">{data.abstract}</p>
                    </div>

                    <div>
                        <h3 className="font-bold uppercase text-sm text-blue-800 border-b border-blue-200 mb-2">Methodology</h3>
                        <p className="text-sm leading-relaxed text-justify">{data.methodology}</p>
                    </div>

                    <div>
                        <h3 className="font-bold uppercase text-sm text-blue-800 border-b border-blue-200 mb-2">Results</h3>
                        <div className="bg-gray-100 p-4 font-mono text-xs border border-gray-300">
                            {data.results}
                        </div>
                    </div>

                    {data.chemicalStructure && (
                        <div className="flex justify-center my-4">
                            <div className="border border-gray-300 p-2 bg-white shadow-sm">
                                <div className="text-[10px] text-gray-400 mb-1 text-center">MOLECULAR STRUCTURE</div>
                                <img src={data.chemicalStructure} className="h-32 object-contain" alt="Structure" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center text-xs text-gray-400 uppercase">
                    Generated by LabOS v9.0.1 | Authorized Personnel Only
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const SpaceMemoRenderer = ({ data, meta }: Document) => {
    return (
        <ScannedDocumentWrapper type="space_memo" seed={data.missionName?.length || 0}>
            <div className="font-sans text-gray-100 h-full relative">
                {/* Starfield Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

                <div className="border-b border-gray-700 pb-6 mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold uppercase tracking-[0.2em]">Astro Command</div>
                            <div className="text-xs text-blue-400 uppercase tracking-widest">Interstellar Operations</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-white/10 uppercase absolute top-4 right-4 pointer-events-none">OFFICIAL</div>
                        <div className="text-xs font-mono text-gray-400">
                            <div>TRANSMISSION: {meta.transmissionId}</div>
                            <div>STARDATE: {meta.stardate}</div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm font-mono">
                        <div className="text-gray-500 uppercase">Mission:</div>
                        <div className="text-white font-bold tracking-wider">{data.missionName}</div>
                        <div className="text-gray-500 uppercase">Origin:</div>
                        <div className="text-blue-300">{meta.origin}</div>
                        <div className="text-gray-500 uppercase">Destination:</div>
                        <div className="text-blue-300">{meta.destination}</div>
                        <div className="text-gray-500 uppercase">Priority:</div>
                        <div className="text-red-400 font-bold animate-pulse">{meta.priority}</div>
                    </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-lg backdrop-blur-sm">
                    <h3 className="text-blue-400 font-bold uppercase text-xs mb-4 tracking-widest border-b border-blue-900/50 pb-2">Message Content</h3>
                    <p className="font-mono text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                        {data.content}
                    </p>
                </div>

                {data.telemetry && (
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                        <div className="bg-gray-800 p-2 rounded border border-gray-700">
                            <div className="text-[10px] text-gray-500 uppercase">Velocity</div>
                            <div className="font-mono text-blue-400">{data.telemetry.velocity}</div>
                        </div>
                        <div className="bg-gray-800 p-2 rounded border border-gray-700">
                            <div className="text-[10px] text-gray-500 uppercase">Fuel</div>
                            <div className="font-mono text-green-400">{data.telemetry.fuel}</div>
                        </div>
                        <div className="bg-gray-800 p-2 rounded border border-gray-700">
                            <div className="text-[10px] text-gray-500 uppercase">Hull</div>
                            <div className="font-mono text-yellow-400">{data.telemetry.hull}</div>
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-8 text-center">
                    <div className="inline-block border border-blue-500/30 px-4 py-1 rounded-full text-[10px] text-blue-400 uppercase tracking-widest">
                        End of Transmission
                    </div>
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const PatentRenderer = ({ data, meta }: Document) => {
    return (
        <ScannedDocumentWrapper type="patent" seed={data.inventionName?.length || 0}>
            <div className="font-serif text-gray-900 h-full">
                <div className="text-center border-b-2 border-black pb-4 mb-6">
                    <div className="text-xs uppercase tracking-widest mb-2">United States Patent Office</div>
                    <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">{data.inventionName}</h1>
                    <div className="flex justify-center gap-8 text-xs font-bold">
                        <div>Patent No.: {meta.patentNumber}</div>
                        <div>Date of Patent: {meta.date}</div>
                    </div>
                </div>

                <div className="flex gap-8 mb-6">
                    <div className="w-1/3 text-xs space-y-2">
                        <div>
                            <span className="font-bold uppercase">Inventor:</span><br />
                            {data.inventor}
                        </div>
                        <div>
                            <span className="font-bold uppercase">Assignee:</span><br />
                            {data.assignee}
                        </div>
                        <div>
                            <span className="font-bold uppercase">Filed:</span><br />
                            {meta.filedDate}
                        </div>
                    </div>
                    <div className="flex-1 text-justify text-xs leading-tight">
                        <span className="font-bold uppercase mr-1">Abstract:</span>
                        {data.abstract}
                    </div>
                </div>

                <div className="border border-black p-4 mb-6 bg-white">
                    {/* Technical Drawing Placeholder */}
                    <div className="w-full h-64 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent"></div>
                        {data.drawingUrl ? (
                            <img src={data.drawingUrl} className="h-full object-contain grayscale contrast-150" alt="Patent Drawing" />
                        ) : (
                            <div className="text-center text-gray-400">
                                <Shield size={100} className="mx-auto mb-2 opacity-20" />
                                <div className="font-mono text-xs">FIG. 1</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="columns-2 gap-6 text-xs text-justify leading-relaxed">
                    {data.description && data.description.split('\n\n').map((para: string, i: number) => (
                        <p key={i} className="mb-4 indent-4">
                            <span className="font-bold mr-1">[{i + 1}]</span>
                            {para}
                        </p>
                    ))}
                </div>

                <div className="mt-8 text-center border-t border-black pt-2">
                    <div className="font-script text-xl">Official Seal</div>
                </div>
            </div>
        </ScannedDocumentWrapper>
    );
};

const FinanceReportRenderer = ({ data, meta }: Document) => {
    return (
        <ScannedDocumentWrapper type="finance_report" seed={data.companyName?.length || 0}>
            <div className="font-sans text-gray-800 h-full">
                <div className="flex justify-between items-end border-b-2 border-green-800 pb-4 mb-6">
                    <div>
                        <div className="text-3xl font-black uppercase tracking-tighter text-green-900">{data.companyName}</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Financial Statement</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-gray-600">{meta.period}</div>
                        <div className="text-xs text-gray-400 uppercase">Fiscal Year {meta.fiscalYear}</div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 border border-gray-200 shadow-inner mb-8">
                    <h3 className="font-bold uppercase text-sm mb-4 text-center">Summary of Operations</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <div className="flex justify-between border-b border-gray-300 pb-1">
                            <span className="text-gray-600">Total Revenue</span>
                            <span className="font-mono font-bold">{data.revenue}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pb-1">
                            <span className="text-gray-600">Gross Profit</span>
                            <span className="font-mono font-bold text-green-700">{data.grossProfit}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pb-1">
                            <span className="text-gray-600">Operating Expenses</span>
                            <span className="font-mono font-bold text-red-700">({data.expenses})</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pb-1">
                            <span className="text-gray-600">Net Income</span>
                            <span className="font-mono font-bold text-blue-700 border-b-2 border-double border-blue-700">{data.netIncome}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-bold uppercase text-xs mb-2 text-gray-500">Executive Summary</h3>
                    <p className="text-sm leading-relaxed text-justify font-serif">
                        {data.summary}
                    </p>
                </div>

                {data.assets && (
                    <div>
                        <h3 className="font-bold uppercase text-xs mb-2 text-gray-500">Key Assets</h3>
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-100 text-gray-600 uppercase">
                                <tr>
                                    <th className="p-2">Asset</th>
                                    <th className="p-2 text-right">Valuation</th>
                                    <th className="p-2 text-right">Change</th>
                                </tr>
                            </thead>
                            <tbody className="font-mono">
                                {data.assets.map((asset: any, i: number) => (
                                    <tr key={i} className="border-b border-gray-100">
                                        <td className="p-2">{asset.name}</td>
                                        <td className="p-2 text-right">{asset.value}</td>
                                        <td className={`p-2 text-right ${asset.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                            {asset.change}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-auto pt-8 text-center">
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                        Confidential Financial Data - Do Not Distribute
                    </div>
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
                {document.type === 'blueprint' && <BlueprintRenderer {...document} />}
                {document.type === 'medical_report' && <MedicalReportRenderer {...document} />}
                {document.type === 'email_thread' && <EmailThreadRenderer {...document} />}
                {document.type === 'dossier' && <DossierRenderer {...document} />}
                {document.type === 'passport' && <PassportRenderer {...document} />}
                {document.type === 'map' && <MapRenderer {...document} />}
                {document.type === 'credential' && <CredentialRenderer {...document} />}
                {document.type === 'evidence' && <EvidenceRenderer {...document} />}
                {document.type === 'lab_report' && <LaboratoryReportRenderer {...document} />}
                {document.type === 'space_memo' && <SpaceMemoRenderer {...document} />}
                {document.type === 'patent' && <PatentRenderer {...document} />}
                {document.type === 'finance_report' && <FinanceReportRenderer {...document} />}

                {!['identity', 'newspaper', 'mission', 'certificate', 'intel', 'transcript', 'blueprint', 'medical_report', 'email_thread', 'dossier', 'passport', 'map', 'credential', 'evidence', 'lab_report', 'space_memo', 'patent', 'finance_report'].includes(document.type) && (
                    <div className="border border-red-500 p-8 text-center text-red-500 bg-black">
                        <AlertTriangle className="mx-auto mb-4" size={48} />
                        {t('dir.unknown_format')}
                    </div>
                )}
            </div>
        </div>
    );
};
