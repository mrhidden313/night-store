import { useState, useContext } from 'react';
import { BookContext, CATEGORIES, WHATSAPP_NUMBER } from '../context/BookContext';
import { Trash2, PlusCircle, Layout, GripVertical, Code, Eye, Image as ImageIcon, Phone, MessageCircle, Settings, RotateCcw, Pencil, Package, Tag, RefreshCw, XCircle, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableBook = ({ book, onDelete, onEdit }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: book.id });
    const style = {
        transform: CSS.Transform.toString(transform), transition,
        padding: '0.7rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                <div {...listeners} style={{ cursor: 'grab', color: 'var(--text-muted)', flexShrink: 0 }}><GripVertical size={16} /></div>
                <div style={{ minWidth: 0 }}>
                    <h4 style={{ margin: 0, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</h4>
                    <div style={{ display: 'flex', gap: '0.3rem', marginTop: '2px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.55rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(22,163,74,0.15)', color: 'var(--primary)', fontWeight: '600' }}>{book.category}</span>
                        <span style={{ fontSize: '0.55rem', padding: '1px 5px', borderRadius: '4px', background: book.type === 'paid' ? 'var(--accent-gold)' : 'var(--accent-green)', color: 'black', fontWeight: 'bold' }}>{book.type?.toUpperCase()}</span>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
                <a href={`/product/${book.id}`} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}><Eye size={14} /></a>
                <button onClick={() => onEdit(book)} style={{ background: 'rgba(251, 191, 36, 0.1)', color: 'var(--accent-gold)', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}><Pencil size={14} /></button>
                <button onClick={() => onDelete(book.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}><Trash2 size={14} /></button>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const { books, trash, addBook, updateBook, deleteBook, restoreBook, permanentDeleteBook, emptyTrash, logo, updateLogo, reorderBooks, whatsappNumber, updateWhatsappNumber, whatsappGroup, updateWhatsappGroup, categoryButtons, updateCategoryButton, resetToDefaults, categories, customCategories, addCategory, deleteCategory, updateCategory } = useContext(BookContext);
    const [formData, setFormData] = useState({
        title: '', excerpt: '', content: '', image: '', category: categories[1] || 'Free', tags: '', type: 'free', author: 'Night Store', price: '', whatsappText: '', downloadUrl: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [codeView, setCodeView] = useState(false);
    const [tempLogo, setTempLogo] = useState('');
    const [tempWhatsapp, setTempWhatsapp] = useState(whatsappNumber || WHATSAPP_NUMBER);
    const [tempGroupLink, setTempGroupLink] = useState(whatsappGroup || '');
    const [activeTab, setActiveTab] = useState('add');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [newCatName, setNewCatName] = useState('');
    const [editingCatId, setEditingCatId] = useState(null);
    const [editCatName, setEditCatName] = useState('');
    const [selectedParent, setSelectedParent] = useState('');
    const [btnBuilder, setBtnBuilder] = useState({ text: 'Offer Link', link: 'https://', color: '#16a34a' });

    const insertCustomButton = () => {
        if (!codeView) {
            setCodeView(true);
            toast.info('Switched to Code View to preserve style!');
        }
        const btnHtml = `<a href="${btnBuilder.link}" target="_blank" class="btn" style="background: ${btnBuilder.color}; color: white; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 15px ${btnBuilder.color}66; margin: 5px 0; display: inline-block; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-weight: bold;">${btnBuilder.text}</a>&nbsp;`;
        setFormData(prev => ({ ...prev, content: prev.content + btnHtml }));
        toast.success('Button inserted into content!');
    };

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = books.findIndex(b => b.id === active.id);
            const newIndex = books.findIndex(b => b.id === over.id);
            reorderBooks(arrayMove(books, oldIndex, newIndex));
            toast.success('Product order updated');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 4000000) return toast.error('Image too large! Keep under 4MB for smooth loading.');
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
                toast.success('Image loaded!');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = (book) => {
        setFormData({
            ...book,
            tags: Array.isArray(book.tags) ? book.tags.join(', ') : book.tags || ''
        });
        setEditingId(book.id);
        setActiveTab('add');
        window.scrollTo(0, 0);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', excerpt: '', content: '', image: '', category: CATEGORIES[1], tags: '', type: 'free', author: 'Night Store', price: '', whatsappText: '', downloadUrl: '' });
        toast.info('Edit cancelled');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content) return toast.error('Title and content required');

        const tagsArray = formData.tags.toString().split(',').map(t => t.trim());
        const bookData = { ...formData, tags: tagsArray };

        setUploading(true);
        setUploadProgress(0);

        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) { clearInterval(progressInterval); return 90; }
                return prev + Math.floor(Math.random() * 15) + 5;
            });
        }, 200);

        try {
            if (editingId) {
                await updateBook({ ...bookData, id: editingId });
                clearInterval(progressInterval);
                setUploadProgress(100);
                setTimeout(() => {
                    setUploading(false);
                    setUploadProgress(0);
                    toast.success('Product updated successfully!');
                }, 500);
                setEditingId(null);
            } else {
                await addBook(bookData);
                clearInterval(progressInterval);
                setUploadProgress(100);
                setTimeout(() => {
                    setUploading(false);
                    setUploadProgress(0);
                    toast.success('Product published!');
                }, 500);
            }
            // Reset form
            setFormData({ title: '', excerpt: '', content: '', image: '', category: categories[1] || 'Free', tags: '', type: 'free', author: 'Night Store', price: '', whatsappText: '', downloadUrl: '' });
        } catch (error) {
            clearInterval(progressInterval);
            setUploading(false);
            setUploadProgress(0);
            toast.error('Operation failed. Please try again.');
        }
    };

    // Category-specific book count
    const countByCategory = (cat) => books.filter(b => b.category === cat).length;

    return (
        <div className="container" style={{ padding: '6rem 1rem 3rem' }}>
            <h1 className="outfit" style={{ marginBottom: '1.5rem', fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layout size={32} className="text-gradient" /> Night Store Admin
            </h1>

            {/* Tab Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>

                <button onClick={() => setActiveTab('add')} className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`} style={{
                    padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
                    background: activeTab === 'add' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                    color: 'white', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap', fontWeight: activeTab === 'add' ? '600' : '400'
                }}>
                    {editingId ? <><Pencil size={18} /> Edit Product</> : <><PlusCircle size={18} /> Add Product</>}
                </button>
                <button onClick={() => setActiveTab('manage')} className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`} style={{
                    padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
                    background: activeTab === 'manage' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                    color: 'white', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap', fontWeight: activeTab === 'manage' ? '600' : '400'
                }}>
                    <Package size={18} /> Inventory
                </button>
                <button onClick={() => setActiveTab('categories')} className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`} style={{
                    padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
                    background: activeTab === 'categories' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                    color: 'white', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap', fontWeight: activeTab === 'categories' ? '600' : '400'
                }}>
                    <Tag size={18} /> Category Deals
                </button>
                <button onClick={() => setActiveTab('settings')} className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} style={{
                    padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
                    background: activeTab === 'settings' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                    color: 'white', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap', fontWeight: activeTab === 'settings' ? '600' : '400'
                }}>
                    <Settings size={18} /> Settings
                </button>
                <button onClick={() => setActiveTab('trash')} className={`tab-btn ${activeTab === 'trash' ? 'active' : ''}`} style={{
                    padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
                    background: activeTab === 'trash' ? '#ef4444' : 'rgba(255,255,255,0.03)',
                    color: 'white', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap', fontWeight: activeTab === 'trash' ? '600' : '400'
                }}>
                    <Trash2 size={18} /> Trash ({trash.length})
                </button>
            </div>

            {/* ADD / EDIT PRODUCT TAB */}
            {activeTab === 'add' && (
                <div className="glass-panel" style={{ padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
                            {editingId ? <><Pencil size={18} /> Edit Product</> : <><PlusCircle size={18} /> Add Product</>}
                        </h2>
                        {editingId && (
                            <button onClick={cancelEdit} className="btn" style={{ fontSize: '0.8rem', border: '1px solid var(--text-muted)', padding: '0.3rem 0.8rem' }}>
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {/* Type */}
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                                <input type="radio" checked={formData.type === 'free'} onChange={() => setFormData({ ...formData, type: 'free' })} /> Free
                            </label>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                                <input type="radio" checked={formData.type === 'paid'} onChange={() => setFormData({ ...formData, type: 'paid' })} /> Paid
                            </label>
                        </div>

                        <input placeholder="Product Title (e.g. NordVPN 1 Year)" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={inputStyle} />
                        <input placeholder="Short Tagline / Excerpt" value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} style={inputStyle} />

                        {/* Image Selection */}
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <input
                                    placeholder="Product Image URL"
                                    value={formData.image ? (formData.image.startsWith('data:') ? '(Uploaded Image)' : formData.image) : ''}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    style={{ ...inputStyle, paddingRight: '2rem' }}
                                />
                                {formData.image && <img src={formData.image} alt="Preview" style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover', border: '1px solid white' }} />}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OR</span>
                            <label className="btn" style={{ cursor: 'pointer', padding: '0.6rem 0.9rem', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--glass-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                                <ImageIcon size={16} /> Upload
                            </label>
                        </div>

                        {/* Category Dropdown */}
                        <div className="admin-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                style={{ ...inputStyle, cursor: 'pointer' }}
                            >
                                {categories.filter(c => c !== 'All').map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <input placeholder="Tags (e.g. vpn, software)" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} style={inputStyle} />
                        </div>

                        {formData.type === 'paid' ? (
                            <input placeholder="Price (e.g. Rs. 500)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={{ ...inputStyle, borderColor: 'rgba(251,191,36,0.3)' }} />
                        ) : (
                            <input placeholder="Download URL (Drive/Dropbox link)" value={formData.downloadUrl} onChange={e => setFormData({ ...formData, downloadUrl: e.target.value })} style={{ ...inputStyle, borderColor: 'var(--primary)' }} />
                        )}

                        {/* WhatsApp Text */}
                        <div style={{ background: 'rgba(37,211,102,0.05)', padding: '0.7rem', borderRadius: '10px', border: '1px solid rgba(37,211,102,0.2)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#25D366', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                                <MessageCircle size={12} /> WhatsApp Message
                            </label>
                            <input placeholder='e.g. I want to buy this deal' value={formData.whatsappText} onChange={e => setFormData({ ...formData, whatsappText: e.target.value })} style={{ ...inputStyle, background: 'rgba(255,255,255,0.03)' }} />
                        </div>

                        {/* Button Generator */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '10px', marginBottom: '1rem', border: '1px solid var(--glass-border)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                <Settings size={14} /> Button Generator (Insert into Content)
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                                <div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Text</span>
                                    <input value={btnBuilder.text} onChange={e => setBtnBuilder({ ...btnBuilder, text: e.target.value })} style={inputStyle} />
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Link / Href</span>
                                    <input value={btnBuilder.link} onChange={e => setBtnBuilder({ ...btnBuilder, link: e.target.value })} style={inputStyle} />
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Color</span>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <input type="color" value={btnBuilder.color} onChange={e => setBtnBuilder({ ...btnBuilder, color: e.target.value })} style={{ height: '35px', width: '40px', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }} />
                                        <input value={btnBuilder.color} onChange={e => setBtnBuilder({ ...btnBuilder, color: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
                                    </div>
                                </div>
                                <button type="button" onClick={insertCustomButton} className="btn" style={{ background: 'var(--primary)', color: 'white', height: '38px', fontSize: '0.8rem' }}>
                                    + Insert
                                </button>
                            </div>
                        </div>

                        {/* Editor Toggle */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setCodeView(!codeView)} className="btn" style={{ padding: '0.2rem 0.6rem', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.75rem' }}>
                                {codeView ? <><Eye size={12} /> Visual</> : <><Code size={12} /> Code</>}
                            </button>
                        </div>

                        <div className="quill-dark-theme">
                            {codeView ? (
                                <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} style={{ ...inputStyle, height: '220px', fontFamily: 'monospace', color: '#88e4ff', marginBottom: '2rem' }} placeholder="HTML Code..." />
                            ) : (
                                <ReactQuill theme="snow" value={formData.content} onChange={val => setFormData({ ...formData, content: val })} style={{ height: '220px', marginBottom: '2rem' }} />
                            )}
                        </div>
                        <button type="submit" disabled={uploading} className="btn btn-primary" style={{ justifyContent: 'center', padding: '0.7rem', position: 'relative', overflow: 'hidden', opacity: uploading ? 0.9 : 1 }}>
                            {uploading ? (
                                <>
                                    <div style={{
                                        position: 'absolute', left: 0, top: 0, height: '100%',
                                        width: `${uploadProgress}%`,
                                        background: uploadProgress === 100 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.15)',
                                        transition: 'width 0.3s ease, background 0.3s ease',
                                        borderRadius: '8px'
                                    }} />
                                    <span style={{ position: 'relative', zIndex: 1 }}>
                                        {uploadProgress === 100 ? 'Completed' : `Uploading... ${Math.min(uploadProgress, 100)}%`}
                                    </span>
                                </>
                            ) : (
                                editingId ? 'Update Product' : 'Publish Deal'
                            )}
                        </button>
                    </form>
                </div>
            )}

            {/* MANAGE PRODUCTS TAB */}
            {activeTab === 'manage' && (
                <div className="glass-panel" style={{ padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '18px' }}>
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Inventory ({books.length})</h2>

                    {/* Category filters */}
                    <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <span key={cat} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                                {cat === 'All' ? `All (${books.length})` : `${cat} (${countByCategory(cat)} items)`}
                            </span>
                        ))}
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={books.map(b => b.id)} strategy={verticalListSortingStrategy}>
                            {books.map(book => <SortableBook key={book.id} book={book} onDelete={deleteBook} onEdit={handleEdit} />)}
                        </SortableContext>
                    </DndContext>

                    {books.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No products yet.</p>}
                </div>
            )}

            {/* CATEGORY BUTTONS TAB */}
            {activeTab === 'categories' && (
                <div className="glass-panel" style={{ padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '18px' }}>

                    {/* ADD NEW CATEGORY */}
                    <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Manage Categories</h2>
                        <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <input
                                    placeholder="New Category Name (e.g. Antivirus)"
                                    value={newCatName}
                                    onChange={e => setNewCatName(e.target.value)}
                                    style={{ ...inputStyle, flex: 1 }}
                                />
                                <button
                                    onClick={() => {
                                        if (newCatName.trim()) {
                                            addCategory(newCatName.trim(), selectedParent || null);
                                            setNewCatName('');
                                            setSelectedParent('');
                                            toast.success('Category added');
                                        }
                                    }}
                                    className="btn btn-primary"
                                    style={{ padding: '0.5rem 1rem' }}
                                >
                                    <PlusCircle size={18} /> Add
                                </button>
                            </div>
                            <select
                                value={selectedParent}
                                onChange={e => setSelectedParent(e.target.value)}
                                style={{ ...inputStyle, width: '100%', cursor: 'pointer', color: 'var(--text-muted)' }}
                            >
                                <option value="">No Parent (Top Level)</option>
                                {categories.filter(c => !['All', 'Free', 'Paid'].includes(c)).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Category Deals & Buttons</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {categories.filter(c => c !== 'All').map(cat => {
                            const btn = categoryButtons[cat] || { text: '', price: '', message: '' };
                            const isFixed = ['Free', 'Paid'].includes(cat);
                            return (
                                <div key={cat} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                                        {editingCatId === customCategories.find(c => c.name === cat)?.id ? (
                                            <div style={{ display: 'flex', gap: '0.4rem', flex: 1, marginRight: '1rem' }}>
                                                <input
                                                    value={editCatName}
                                                    onChange={(e) => setEditCatName(e.target.value)}
                                                    style={{ ...inputStyle, padding: '0.3rem' }}
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => {
                                                        updateCategory(editingCatId, cat, editCatName);
                                                        setEditingCatId(null);
                                                        toast.success('Category updated');
                                                    }}
                                                    className="btn"
                                                    style={{ background: 'var(--primary)', padding: '0.3rem', color: 'white' }}
                                                >
                                                    <Save size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingCatId(null)}
                                                    className="btn"
                                                    style={{ background: 'rgba(255,255,255,0.1)', padding: '0.3rem' }}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
                                                {cat}
                                                {(() => {
                                                    const catObj = customCategories.find(c => c.name === cat);
                                                    return catObj?.parent ? <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'normal' }}> (in {catObj.parent})</span> : null;
                                                })()}
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}> ({countByCategory(cat)} items)</span>
                                            </h4>
                                        )}

                                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                                            {!isFixed && !editingCatId && (
                                                <button
                                                    onClick={() => {
                                                        const catObj = customCategories.find(c => c.name === cat);
                                                        if (catObj) {
                                                            setEditingCatId(catObj.id);
                                                            setEditCatName(cat);
                                                        }
                                                    }}
                                                    className="btn"
                                                    style={{ padding: '0.3rem', color: 'var(--accent-gold)', border: '1px solid rgba(251,191,36,0.3)' }}
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                            )}
                                            {!isFixed && (
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Delete category "${cat}"? \n\n⚠️ WARNING: ALL products in this category will also be moved to TRASH!`)) {
                                                            const catObj = customCategories.find(c => c.name === cat);
                                                            if (catObj) {
                                                                deleteCategory(catObj.id, cat);
                                                                toast.success('Category & Products moved to Trash');
                                                            } else {
                                                                toast.error('Error finding category ID.');
                                                            }
                                                        }
                                                    }}
                                                    className="btn"
                                                    style={{ padding: '0.3rem', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        <input
                                            placeholder="Button Text (e.g. View All Deals)"
                                            value={btn.text}
                                            onChange={e => updateCategoryButton(cat, { ...btn, text: e.target.value })}
                                            style={inputStyle}
                                        />
                                        <input
                                            placeholder="Offer / Price"
                                            value={btn.price}
                                            onChange={e => updateCategoryButton(cat, { ...btn, price: e.target.value })}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <input
                                        placeholder="WhatsApp Message"
                                        value={btn.message}
                                        onChange={e => updateCategoryButton(cat, { ...btn, message: e.target.value })}
                                        style={{ ...inputStyle, marginTop: '0.5rem' }}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Also allow All category button */}
                    <div style={{ marginTop: '1.5rem', background: 'rgba(22,163,74,0.05)', border: '1px solid rgba(22,163,74,0.2)', padding: '1rem', borderRadius: '12px' }}>
                        <h4 style={{ marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--accent-gold)' }}>All Products Button</h4>
                        {(() => {
                            const btn = categoryButtons['All'] || { text: '', price: '', message: '' };
                            return (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        <input placeholder="Button Text" value={btn.text} onChange={e => updateCategoryButton('All', { ...btn, text: e.target.value })} style={inputStyle} />
                                        <input placeholder="Offer / Price" value={btn.price} onChange={e => updateCategoryButton('All', { ...btn, price: e.target.value })} style={inputStyle} />
                                    </div>
                                    <input placeholder="WhatsApp Message" value={btn.message} onChange={e => updateCategoryButton('All', { ...btn, message: e.target.value })} style={{ ...inputStyle, marginTop: '0.5rem' }} />
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* TRASH TAB */}
            {activeTab === 'trash' && (
                <div className="glass-panel" style={{ padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                            <Trash2 size={20} /> Trash ({trash.length})
                        </h2>
                        {trash.length > 0 && (
                            <button
                                onClick={() => {
                                    if (window.confirm("Are you sure? This will delete ALL items in the trash PERMANENTLY.")) {
                                        emptyTrash();
                                        toast.success("Trash emptied");
                                    }
                                }}
                                className="btn"
                                style={{ background: '#ef4444', color: 'white', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                            >
                                Empty Trash
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {trash.map(item => (
                            <div key={item.id} style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--glass-border)',
                                padding: '0.8rem',
                                borderRadius: '10px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.title}</h4>
                                    <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>Deleted</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => {
                                            restoreBook(item.id);
                                            toast.success("Restored successfully");
                                        }}
                                        className="btn"
                                        title="Restore"
                                        style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem', borderRadius: '6px' }}
                                    >
                                        <RefreshCw size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Delete permanently? This cannot be undone.")) {
                                                permanentDeleteBook(item.id);
                                                toast.success("Deleted permanently");
                                            }
                                        }}
                                        className="btn"
                                        title="Delete Forever"
                                        style={{ background: '#ef4444', color: 'white', padding: '0.4rem', borderRadius: '6px' }}
                                    >
                                        <XCircle size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {trash.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Trash is empty.</p>}
                    </div>
                </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
                <div className="glass-panel" style={{ padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '18px' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>⚙️ Settings</h2>

                    {/* WhatsApp */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#25D366', fontSize: '0.9rem' }}><Phone size={14} /> WhatsApp Number</h4>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <input placeholder="e.g. 923301980891" value={tempWhatsapp} onChange={e => setTempWhatsapp(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                            <button onClick={() => { updateWhatsappNumber(tempWhatsapp); toast.success('Saved!'); }} className="btn whatsapp-btn" style={{ padding: '0.4rem 0.7rem' }}><Phone size={14} /></button>
                        </div>
                        <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>With country code, no + sign</p>
                    </div>

                    {/* WhatsApp Group Link */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#25D366', fontSize: '0.9rem' }}><MessageCircle size={14} /> WhatsApp Group Link</h4>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <input placeholder="https://chat.whatsapp.com/..." value={tempGroupLink} onChange={e => setTempGroupLink(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                            <button onClick={() => { updateWhatsappGroup(tempGroupLink); toast.success('Group link saved!'); }} className="btn whatsapp-btn" style={{ padding: '0.4rem 0.7rem' }}><MessageCircle size={14} /></button>
                        </div>
                        <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Shows on About page. Leave empty to hide.</p>
                    </div>

                    {/* Logo */}
                    <div>
                        <h4 style={{ marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}><Layout size={14} /> Logo</h4>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <input placeholder="Logo Image URL" value={tempLogo} onChange={e => setTempLogo(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                            <button onClick={() => { updateLogo(tempLogo); toast.success('Logo saved'); }} className="btn btn-primary" style={{ padding: '0.4rem 0.7rem' }}><ImageIcon size={14} /></button>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                        <h4 style={{ marginBottom: '0.8rem', color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <RotateCcw size={14} /> Reset System
                        </h4>

                        <button
                            onClick={() => {
                                if (window.confirm('Reset all data to default products?')) {
                                    resetToDefaults();
                                }
                            }}
                            className="btn"
                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', width: '100%', justifyContent: 'center' }}
                        >
                            <RotateCcw size={16} /> Reset to Default
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.6rem 0.7rem', borderRadius: '8px', color: 'white', fontSize: '0.85rem', outline: 'none', width: '100%' };

export default AdminDashboard;
