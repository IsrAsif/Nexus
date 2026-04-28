import React, { useState, useRef } from 'react';
import {
  FileText, Upload, Eye, Download, Trash2, PenLine,
  CheckCircle, Clock, AlertCircle, Search, Filter,
  X, File, FileCheck, ChevronDown, Share2
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import SignaturePad from '../../components/documents/SignaturePad';

type DocStatus = 'Draft' | 'In Review' | 'Signed';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: DocStatus;
  shared: boolean;
  signedBy?: string[];
  previewUrl?: string;
}

const INITIAL_DOCS: Document[] = [
  { id:1, name:'Investment_Term_Sheet_2026.pdf',    type:'PDF',         size:'1.2 MB', uploadedAt:'2026-04-10', status:'In Review', shared:true,  signedBy:[]             },
  { id:2, name:'NDA_Agreement_Nexus.pdf',           type:'PDF',         size:'0.8 MB', uploadedAt:'2026-04-08', status:'Signed',    shared:true,  signedBy:['Ahmad Raza'] },
  { id:3, name:'Business_Plan_Q2_2026.docx',        type:'Word',        size:'3.2 MB', uploadedAt:'2026-04-05', status:'Draft',     shared:false, signedBy:[]             },
  { id:4, name:'Financial_Projections_2026.xlsx',   type:'Spreadsheet', size:'2.1 MB', uploadedAt:'2026-04-01', status:'Draft',     shared:false, signedBy:[]             },
  { id:5, name:'Partnership_Contract_v2.pdf',       type:'PDF',         size:'1.9 MB', uploadedAt:'2026-03-28', status:'Signed',    shared:true,  signedBy:['Sarah Johnson','Carlos Rivera'] },
];

const statusConfig: Record<DocStatus, { icon: React.ReactNode; badge: string; color: string }> = {
  'Draft':     { icon: <AlertCircle size={14}/>, badge: 'gray',    color: 'text-gray-500'   },
  'In Review': { icon: <Clock       size={14}/>, badge: 'warning', color: 'text-amber-600'  },
  'Signed':    { icon: <CheckCircle size={14}/>, badge: 'success', color: 'text-green-600'  },
};

const fileIcon = (type: string) => {
  if (type === 'PDF')         return <FileText size={22} className="text-red-500"/>;
  if (type === 'Word')        return <FileText size={22} className="text-blue-500"/>;
  if (type === 'Spreadsheet') return <FileText size={22} className="text-green-500"/>;
  return <File size={22} className="text-gray-500"/>;
};

export const DocumentChamber: React.FC = () => {
  const [docs,            setDocs]            = useState<Document[]>(INITIAL_DOCS);
  const [search,          setSearch]          = useState('');
  const [filterStatus,    setFilterStatus]    = useState<DocStatus | 'All'>('All');
  const [previewDoc,      setPreviewDoc]      = useState<Document | null>(null);
  const [signingDoc,      setSigningDoc]      = useState<Document | null>(null);
  const [signature,       setSignature]       = useState<string | null>(null);
  const [dragging,        setDragging]        = useState(false);
  const [uploadSuccess,   setUploadSuccess]   = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = docs.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: number, status: DocStatus) =>
    setDocs(p => p.map(d => d.id === id ? { ...d, status } : d));

  const deleteDoc = (id: number) => setDocs(p => p.filter(d => d.id !== id));

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const ext  = file.name.split('.').pop()?.toLowerCase();
    const type = ext === 'pdf' ? 'PDF' : ext === 'docx' ? 'Word' : ext === 'xlsx' ? 'Spreadsheet' : 'File';
    const newDoc: Document = {
      id: Date.now(), name: file.name,
      type, size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'Draft', shared: false, signedBy: [],
    };
    setDocs(p => [newDoc, ...p]);
    setUploadSuccess(file.name);
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  const handleSign = (docId: number, dataUrl: string) => {
    setSignature(dataUrl);
    setDocs(p => p.map(d => d.id === docId
      ? { ...d, status: 'Signed', signedBy: [...(d.signedBy || []), 'You'] }
      : d
    ));
    setSigningDoc(null);
  };

  const counts = {
    all:      docs.length,
    draft:    docs.filter(d => d.status === 'Draft').length,
    review:   docs.filter(d => d.status === 'In Review').length,
    signed:   docs.filter(d => d.status === 'Signed').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-600 mt-1">Manage deals, contracts and agreements</p>
        </div>
        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" className="hidden"
            accept=".pdf,.doc,.docx,.xlsx,.xls"
            onChange={e => handleFileUpload(e.target.files)} />
          <Button variant="outline" leftIcon={<Upload size={16}/>}
            onClick={() => fileInputRef.current?.click()}>
            Upload
          </Button>
        </div>
      </div>

      {/* Upload success toast */}
      {uploadSuccess && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <CheckCircle size={16} className="text-green-600 flex-shrink-0"/>
          <p className="text-sm text-green-700 font-medium">"{uploadSuccess}" uploaded successfully</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Total',     value: counts.all,    color:'text-gray-700',    bg:'bg-gray-50     border-gray-200'   },
          { label:'Draft',     value: counts.draft,  color:'text-gray-500',    bg:'bg-gray-50     border-gray-200'   },
          { label:'In Review', value: counts.review, color:'text-amber-600',   bg:'bg-amber-50    border-amber-100'  },
          { label:'Signed',    value: counts.signed, color:'text-green-600',   bg:'bg-green-50    border-green-100'  },
        ].map(s => (
          <Card key={s.label} className={`border ${s.bg}`}>
            <CardBody>
              <div className="text-center">
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Upload drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFileUpload(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragging ? 'border-primary-400 bg-primary-50' : 'border-gray-200 bg-gray-50 hover:border-primary-300 hover:bg-primary-50/30'
        }`}
      >
        <Upload size={32} className={`mx-auto mb-3 ${dragging ? 'text-primary-500' : 'text-gray-400'}`}/>
        <p className="text-sm font-medium text-gray-700">Drop files here or click to upload</p>
        <p className="text-xs text-gray-400 mt-1">Supports PDF, DOCX, XLSX up to 50MB</p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input type="text" placeholder="Search documents..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['All','Draft','In Review','Signed'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 text-sm rounded-lg border font-medium transition-all
                ${filterStatus === s
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Document List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Documents <span className="text-gray-400 font-normal ml-1">({filtered.length})</span>
            </h2>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FileText size={40} className="mx-auto mb-3 opacity-40"/>
              <p className="text-sm">No documents found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(doc => (
                <div key={doc.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">

                  {/* File icon */}
                  <div className="p-2.5 bg-gray-100 rounded-xl flex-shrink-0">
                    {fileIcon(doc.type)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                      {doc.shared && <Badge variant="secondary" size="sm">Shared</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{doc.type}</span>
                      <span>·</span>
                      <span>{doc.size}</span>
                      <span>·</span>
                      <span>Uploaded {doc.uploadedAt}</span>
                      {doc.signedBy && doc.signedBy.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-green-600 font-medium">
                            ✓ Signed by {doc.signedBy.join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex-shrink-0">
                    <Badge
                      variant={statusConfig[doc.status].badge as any}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      {statusConfig[doc.status].icon}
                      {doc.status}
                    </Badge>
                  </div>

                  {/* Status changer */}
                  <div className="flex-shrink-0">
                    <select
                      value={doc.status}
                      onChange={e => updateStatus(doc.id, e.target.value as DocStatus)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary-500 bg-white text-gray-600 cursor-pointer"
                    >
                      <option value="Draft">Draft</option>
                      <option value="In Review">In Review</option>
                      <option value="Signed">Signed</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setPreviewDoc(doc)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Preview">
                      <Eye size={16}/>
                    </button>
                    {doc.status !== 'Signed' && (
                      <button onClick={() => setSigningDoc(doc)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Sign">
                        <PenLine size={16}/>
                      </button>
                    )}
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download">
                      <Download size={16}/>
                    </button>
                    <button onClick={() => deleteDoc(doc.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* ── Preview Modal ── */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3 min-w-0">
                {fileIcon(previewDoc.type)}
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{previewDoc.name}</h3>
                  <p className="text-xs text-gray-500">{previewDoc.size} · {previewDoc.uploadedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={statusConfig[previewDoc.status].badge as any}>
                  {previewDoc.status}
                </Badge>
                <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-gray-600 ml-2">
                  <X size={18}/>
                </button>
              </div>
            </div>

            {/* Preview body */}
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 min-h-64 flex items-center justify-center">
                <div className="text-center max-w-sm">
                  <FileCheck size={48} className="mx-auto mb-4 text-primary-400"/>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">{previewDoc.name}</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    This is a preview of the document. In production, the actual PDF/document content would render here using a PDF viewer library.
                  </p>
                  <div className="space-y-2 text-left bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Document Details</p>
                    {[
                      { label:'Type',      value: previewDoc.type                    },
                      { label:'Size',      value: previewDoc.size                    },
                      { label:'Uploaded',  value: previewDoc.uploadedAt              },
                      { label:'Status',    value: previewDoc.status                  },
                      { label:'Shared',    value: previewDoc.shared ? 'Yes' : 'No'   },
                      ...(previewDoc.signedBy?.length ? [{ label:'Signed by', value: previewDoc.signedBy.join(', ') }] : []),
                    ].map(r => (
                      <div key={r.label} className="flex justify-between text-sm">
                        <span className="text-gray-500">{r.label}</span>
                        <span className="font-medium text-gray-900">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              {previewDoc.status !== 'Signed' && (
                <Button leftIcon={<PenLine size={15}/>} onClick={() => { setSigningDoc(previewDoc); setPreviewDoc(null); }}>
                  Sign Document
                </Button>
              )}
              <Button variant="outline" leftIcon={<Download size={15}/>}>Download</Button>
              <Button variant="ghost" onClick={() => setPreviewDoc(null)} className="ml-auto">Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Signature Pad Modal ── */}
      {signingDoc && (
        <SignaturePad
          onSave={dataUrl => handleSign(signingDoc.id, dataUrl)}
          onCancel={() => setSigningDoc(null)}
        />
      )}

      {/* ── Signature success toast ── */}
      {signature && !signingDoc && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
          <CheckCircle size={18}/>
          <div>
            <p className="font-semibold text-sm">Document Signed!</p>
            <p className="text-xs text-green-100">Status updated to Signed</p>
          </div>
          <button onClick={() => setSignature(null)} className="ml-4 text-green-200 hover:text-white">
            <X size={16}/>
          </button>
        </div>
      )}
    </div>
  );
};
