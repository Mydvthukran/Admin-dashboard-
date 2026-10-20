import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import type { Banner, ServiceCategory, ServiceListing, StaticContentPage } from '../../types';
import { Modal } from '../common/Modal';
import {
  FileText,
  Image as ImageIcon,
  Layers,
  FolderTree,
  PlusCircle,
  Edit3,
  Trash2,
  Tag,
  Clock,
  ShieldCheck,
  Star,
  MapPin,
  Save,
  Zap,
  Wrench,
  Sparkles,
  Scissors,
  Users,
  Camera,
  Paintbrush
} from 'lucide-react';

export const ContentManagementView: React.FC = () => {
  const {
    banners,
    categories,
    listings,
    staticPages,
    activeSubtab,
    setActiveSubtab,
    addBanner,
    updateBanner,
    deleteBanner,
    addCategory,
    updateCategory,
    addListing,
    updateListing,
    deleteListing,
    updateStaticPage
  } = useAdmin();

  // Banners state
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isNewBannerModalOpen, setIsNewBannerModalOpen] = useState(false);
  const [bannerFormData, setBannerFormData] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    targetCategory: 'Repairs and installations',
    badgeText: 'FEATURED',
    placement: 'hero_carousel',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    isActive: true
  });

  // Category state
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<Partial<ServiceCategory>>({
    name: '',
    slug: '',
    iconName: 'Wrench',
    description: '',
    commissionRate: 15,
    serviceCount: 0,
    isActive: true,
    geofenceAvailability: ['Kolkata', 'Nabadwip', 'All West Bengal'],
    orderPriority: 10
  });

  // Listing state
  const [editingListing, setEditingListing] = useState<ServiceListing | null>(null);
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [listingFormData, setListingFormData] = useState<Partial<ServiceListing>>({
    categoryId: 'cat_02',
    categoryName: 'Repairs and installations',
    title: '',
    basePrice: 499,
    durationMinutes: 45,
    description: '',
    features: ['PunchX certified professional', 'Genuine tools', 'Post service warranty'],
    warrantyDays: 30,
    isActive: true,
    popularityScore: 85
  });

  // Static Page Editing state
  const [selectedPage, setSelectedPage] = useState<StaticContentPage>(staticPages[0]);
  const [pageSections, setPageSections] = useState(selectedPage.sections);

  // Helper for Category Icons
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap size={18} />;
      case 'Sparkles': return <Sparkles size={18} />;
      case 'Scissors': return <Scissors size={18} />;
      case 'Camera': return <Camera size={18} />;
      case 'Users': return <Users size={18} />;
      case 'Paintbrush': return <Paintbrush size={18} />;
      default: return <Wrench size={18} />;
    }
  };

  const handleSaveBanner = () => {
    if (editingBanner) {
      updateBanner(editingBanner.id, bannerFormData);
      setEditingBanner(null);
    } else {
      addBanner(bannerFormData as any);
      setIsNewBannerModalOpen(false);
    }
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryFormData);
      setEditingCategory(null);
    } else {
      addCategory({
        name: categoryFormData.name || 'New Category',
        slug: (categoryFormData.name || 'new').toLowerCase().replace(/\s+/g, '-'),
        iconName: categoryFormData.iconName || 'Wrench',
        description: categoryFormData.description || '',
        commissionRate: categoryFormData.commissionRate || 15,
        serviceCount: 0,
        isActive: categoryFormData.isActive ?? true,
        geofenceAvailability: categoryFormData.geofenceAvailability || ['Kolkata'],
        orderPriority: categoryFormData.orderPriority || 10
      });
      setIsNewCategoryModalOpen(false);
    }
  };

  const handleSaveListing = () => {
    const selectedCat = categories.find((c) => c.id === listingFormData.categoryId);
    if (editingListing) {
      updateListing(editingListing.id, {
        ...listingFormData,
        categoryName: selectedCat?.name || editingListing.categoryName
      });
      setEditingListing(null);
    } else {
      addListing({
        categoryId: listingFormData.categoryId || 'cat_01',
        categoryName: selectedCat?.name || 'General',
        title: listingFormData.title || 'New Service',
        basePrice: listingFormData.basePrice || 299,
        durationMinutes: listingFormData.durationMinutes || 30,
        description: listingFormData.description || '',
        features: listingFormData.features || ['Verified pro', 'Quality assured'],
        warrantyDays: listingFormData.warrantyDays || 15,
        isActive: true,
        popularityScore: 80
      });
      setIsNewListingModalOpen(false);
    }
  };

  const handleSavePage = () => {
    updateStaticPage(selectedPage.slug, pageSections);
  };

  return (
    <div className="view-container">
      {/* View Header with Subtab Navigation */}
      <div className="view-header">
        <div>
          <div className="section-supertitle">SECTION 2</div>
          <h1 className="view-title">Content Management</h1>
          <p className="view-subtitle">
            Configure mobile app hero banners, legal terms, 40+ service listings, and category hierarchy.
          </p>
        </div>

        {/* Subtabs matching handwritten notes: i. Banner, ii. Content, iii. Listing, iv. Categories */}
        <div className="subtab-pills">
          <button
            className={`subtab-pill ${activeSubtab === 'banner' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('banner')}
          >
            <ImageIcon size={15} />
            <span>i. Banner</span>
            <span className="pill-badge">{banners.length}</span>
          </button>
          <button
            className={`subtab-pill ${activeSubtab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('content')}
          >
            <FileText size={15} />
            <span>ii. Content</span>
            <span className="pill-badge">{staticPages.length}</span>
          </button>
          <button
            className={`subtab-pill ${activeSubtab === 'listing' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('listing')}
          >
            <Layers size={15} />
            <span>iii. Listing</span>
            <span className="pill-badge">{listings.length}</span>
          </button>
          <button
            className={`subtab-pill ${activeSubtab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveSubtab('categories')}
          >
            <FolderTree size={15} />
            <span>iv. Categories</span>
            <span className="pill-badge">{categories.length}</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: BANNER */}
      {activeSubtab === 'banner' && (
        <div className="subtab-content">
          <div className="subtab-action-header mb-4 flex justify-between items-center">
            <div>
              <h3 className="card-title">Promotional Banners & Mobile Feed Sliders</h3>
              <p className="card-subtitle">
                Banners displayed on PunchX consumer mobile app and web homepage carousel.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setBannerFormData({
                  title: '',
                  subtitle: '',
                  imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
                  targetCategory: 'Cleaning and home care',
                  badgeText: 'SUMMER SPECIAL',
                  placement: 'hero_carousel',
                  startDate: '2026-04-01',
                  endDate: '2026-06-30',
                  isActive: true
                });
                setIsNewBannerModalOpen(true);
              }}
            >
              <PlusCircle size={16} /> Add Promotional Banner
            </button>
          </div>

          {/* Interactive Mobile Simulator + Banner Grid */}
          <div className="banner-layout-grid">
            {/* Live Mobile Screen Simulator */}
            <div className="mobile-simulator-wrapper">
              <div className="mobile-phone-frame">
                <div className="mobile-phone-notch"></div>
                <div className="mobile-phone-screen">
                  <div className="mobile-app-header">
                    <span className="mobile-logo">Punch<span className="text-punch-orange">X</span></span>
                    <span className="mobile-zone-tag"><MapPin size={10} /> Kolkata, WB</span>
                  </div>

                  <div className="mobile-carousel-preview">
                    <div className="mobile-carousel-tag">LIVE HERO CAROUSEL</div>
                    {banners.filter((b) => b.isActive).slice(0, 1).map((b) => (
                      <div key={b.id} className="mobile-banner-card">
                        <img src={b.imageUrl} alt={b.title} className="mobile-banner-img" />
                        <div className="mobile-banner-overlay">
                          {b.badgeText && <span className="mobile-badge">{b.badgeText}</span>}
                          <div className="mobile-title">{b.title}</div>
                          <div className="mobile-sub">{b.subtitle}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mobile-mini-categories">
                    <div className="mobile-cat-pill">AC Service</div>
                    <div className="mobile-cat-pill">Cleaning</div>
                    <div className="mobile-cat-pill">Plumbing</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Banners List */}
            <div className="banners-list-container">
              {banners.map((banner) => (
                <div key={banner.id} className="banner-admin-card">
                  <div className="banner-preview-img-container">
                    <img src={banner.imageUrl} alt={banner.title} className="banner-img" />
                    {banner.badgeText && (
                      <span className="banner-overlay-badge">{banner.badgeText}</span>
                    )}
                    <span
                      className={`banner-status-tag ${banner.isActive ? 'active' : 'inactive'}`}
                    >
                      {banner.isActive ? 'ACTIVE' : 'DRAFT'}
                    </span>
                  </div>

                  <div className="banner-admin-details">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="banner-title">{banner.title}</h4>
                        <p className="banner-subtitle">{banner.subtitle}</p>
                      </div>
                      <div className="banner-clicks-pill">
                        <Tag size={12} /> {banner.clicks} Clicks
                      </div>
                    </div>

                    <div className="banner-meta-row">
                      <span className="meta-tag">
                        Placement: <strong>{banner.placement.replace('_', ' ')}</strong>
                      </span>
                      <span className="meta-tag">
                        Category: <strong>{banner.targetCategory}</strong>
                      </span>
                      <span className="meta-tag">
                        Valid: {banner.startDate} to {banner.endDate}
                      </span>
                    </div>

                    <div className="banner-card-actions">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          setEditingBanner(banner);
                          setBannerFormData(banner);
                        }}
                      >
                        <Edit3 size={14} /> Edit Banner
                      </button>
                      <button
                        className={`btn btn-sm ${
                          banner.isActive ? 'btn-red-dim' : 'btn-emerald-dim'
                        }`}
                        onClick={() => updateBanner(banner.id, { isActive: !banner.isActive })}
                      >
                        {banner.isActive ? 'Pause Banner' : 'Activate Banner'}
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-red"
                        onClick={() => deleteBanner(banner.id)}
                        title="Delete banner"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CONTENT (POLICIES, TERMS & FAQS) */}
      {activeSubtab === 'content' && (
        <div className="subtab-content">
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Platform Policies & Legal Content Editor</h3>
                <p className="card-subtitle">
                  Synchronized in real-time to PunchX web app and native customer/pro applications.
                </p>
              </div>
              <button className="btn btn-primary" onClick={handleSavePage}>
                <Save size={16} /> Save & Publish Content
              </button>
            </div>

            {/* Page Selector Tabs */}
            <div className="page-tabs-bar">
              {staticPages.map((page) => (
                <button
                  key={page.id}
                  className={`page-tab-btn ${selectedPage.id === page.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPage(page);
                    setPageSections(page.sections);
                  }}
                >
                  <FileText size={14} />
                  <span>{page.title}</span>
                </button>
              ))}
            </div>

            <div className="page-meta-header">
              <div>
                <span className="text-muted text-xs">Page Slug:</span>{' '}
                <code className="text-code">/{selectedPage.slug}</code>
              </div>
              <div className="text-muted text-xs">
                Last modified: {selectedPage.lastUpdated} by {selectedPage.updatedBy}
              </div>
            </div>

            {/* Editable Sections */}
            <div className="sections-editor-list">
              {pageSections.map((sec, idx) => (
                <div key={idx} className="section-editor-box">
                  <div className="form-group mb-2">
                    <label className="form-label text-xs font-semibold">Section Clause Title</label>
                    <input
                      type="text"
                      className="input-text font-semibold"
                      value={sec.title}
                      onChange={(e) => {
                        const updated = [...pageSections];
                        updated[idx].title = e.target.value;
                        setPageSections(updated);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label text-xs font-semibold">Clause Text</label>
                    <textarea
                      className="textarea-input"
                      rows={4}
                      value={sec.content}
                      onChange={(e) => {
                        const updated = [...pageSections];
                        updated[idx].content = e.target.value;
                        setPageSections(updated);
                      }}
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: LISTING (CATALOG OF 40+ SERVICES) */}
      {activeSubtab === 'listing' && (
        <div className="subtab-content">
          <div className="subtab-action-header mb-4 flex justify-between items-center">
            <div>
              <h3 className="card-title">Service Listings & Pricing Engine</h3>
              <p className="card-subtitle">
                Manage service base rates, estimated job duration, warranty commitments, and feature tags.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setListingFormData({
                  categoryId: categories[0]?.id || 'cat_01',
                  categoryName: categories[0]?.name || 'General',
                  title: '',
                  basePrice: 499,
                  durationMinutes: 45,
                  description: '',
                  features: ['PunchX certified professional', 'Genuine tools', 'Post service warranty'],
                  warrantyDays: 30,
                  isActive: true,
                  popularityScore: 85
                });
                setIsNewListingModalOpen(true);
              }}
            >
              <PlusCircle size={16} /> Add Service Listing
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-bar mb-4">
            <div className="filter-group">
              <label>Filter by Category:</label>
              <select
                className="select-input"
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              >
                <option value="all">All Service Categories ({listings.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Listings Table */}
          <div className="card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Service Listing</th>
                    <th>Category</th>
                    <th>Starting Base Price</th>
                    <th>Duration</th>
                    <th>Warranty</th>
                    <th>Customer Rating</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings
                    .filter(
                      (l) =>
                        selectedCategoryFilter === 'all' || l.categoryId === selectedCategoryFilter
                    )
                    .map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="font-bold text-sm text-foreground">{item.title}</div>
                          <div className="cell-sub text-muted line-clamp-1">{item.description}</div>
                          <div className="feature-tags-row mt-1">
                            {item.features.map((f, i) => (
                              <span key={i} className="mini-tag">
                                {f}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-purple">{item.categoryName}</span>
                        </td>
                        <td>
                          <div className="font-bold text-emerald text-base">₹{item.basePrice}</div>
                        </td>
                        <td>
                          <span className="flex items-center gap-1 text-sm text-muted">
                            <Clock size={13} /> {item.durationMinutes} mins
                          </span>
                        </td>
                        <td>
                          {item.warrantyDays > 0 ? (
                            <span className="badge badge-neutral">
                              <ShieldCheck size={12} /> {item.warrantyDays} Days
                            </span>
                          ) : (
                            <span className="text-xs text-muted">No Warranty</span>
                          )}
                        </td>
                        <td>
                          <div className="rating-pill">
                            <Star size={12} className="fill-amber text-amber" />
                            <span>{item.rating.toFixed(2)}</span>
                            <span className="text-xs text-muted">({item.reviewsCount})</span>
                          </div>
                        </td>
                        <td>
                          <button
                            className={`badge ${item.isActive ? 'badge-success' : 'badge-neutral'} cursor-pointer`}
                            onClick={() => updateListing(item.id, { isActive: !item.isActive })}
                          >
                            {item.isActive ? 'Bookable' : 'Hidden'}
                          </button>
                        </td>
                        <td className="text-right">
                          <div className="row-actions">
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => {
                                setEditingListing(item);
                                setListingFormData(item);
                              }}
                              title="Edit Listing"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              className="btn btn-ghost btn-sm text-red"
                              onClick={() => deleteListing(item.id)}
                              title="Delete Listing"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: CATEGORIES */}
      {activeSubtab === 'categories' && (
        <div className="subtab-content">
          <div className="subtab-action-header mb-4 flex justify-between items-center">
            <div>
              <h3 className="card-title">40+ Main Service Categories</h3>
              <p className="card-subtitle">
                Hierarchical catalogue grouping with take-rate % and geofence assignments (Kolkata & Nabadwip).
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setCategoryFormData({
                  name: '',
                  slug: '',
                  iconName: 'Wrench',
                  description: '',
                  commissionRate: 15,
                  serviceCount: 0,
                  isActive: true,
                  geofenceAvailability: ['Kolkata', 'Nabadwip'],
                  orderPriority: 10
                });
                setIsNewCategoryModalOpen(true);
              }}
            >
              <PlusCircle size={16} /> Add Category
            </button>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <div key={cat.id} className="category-card">
                <div className="category-card-header">
                  <div className="category-icon-box text-punch-orange bg-orange-dim">
                    {renderCategoryIcon(cat.iconName)}
                  </div>
                  <div>
                    <h4 className="category-name">{cat.name}</h4>
                    <span className="text-xs text-muted">Slug: /{cat.slug}</span>
                  </div>
                  <span
                    className={`badge ${cat.isActive ? 'badge-success' : 'badge-neutral'} ml-auto`}
                  >
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="category-desc">{cat.description}</p>

                <div className="category-meta-box">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">Take-Rate Commission:</span>
                    <span className="font-bold text-punch-orange text-sm">{cat.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-muted">Services Listed:</span>
                    <span className="font-semibold">{cat.serviceCount} Live</span>
                  </div>
                </div>

                <div className="category-geofences">
                  <span className="text-xs text-muted">Operating In:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cat.geofenceAvailability.map((g, i) => (
                      <span key={i} className="zone-mini-tag">
                        <MapPin size={9} /> {g}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="category-card-footer mt-4">
                  <button
                    className="btn btn-secondary btn-sm w-full"
                    onClick={() => {
                      setEditingCategory(cat);
                      setCategoryFormData(cat);
                    }}
                  >
                    <Edit3 size={14} /> Edit Category & Commission
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Banner */}
      {(isNewBannerModalOpen || editingBanner) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsNewBannerModalOpen(false);
            setEditingBanner(null);
          }}
          title={editingBanner ? 'Edit Promotional Banner' : 'Create Promotional Banner'}
          subtitle="Configure mobile app banner copy, banner image, and destination category."
        >
          <div className="banner-form-body">
            <div className="form-group mb-3">
              <label className="form-label">Banner Headline</label>
              <input
                type="text"
                className="input-text"
                placeholder="e.g. Pre-Summer AC Servicing Flat ₹200 OFF"
                value={bannerFormData.title || ''}
                onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Subtitle / Description</label>
              <input
                type="text"
                className="input-text"
                placeholder="e.g. 30-Day cooling warranty included by verified technicians"
                value={bannerFormData.subtitle || ''}
                onChange={(e) => setBannerFormData({ ...bannerFormData, subtitle: e.target.value })}
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                className="input-text"
                placeholder="https://..."
                value={bannerFormData.imageUrl || ''}
                onChange={(e) => setBannerFormData({ ...bannerFormData, imageUrl: e.target.value })}
              />
              {bannerFormData.imageUrl && (
                <div className="image-preview-box mt-2">
                  <img
                    src={bannerFormData.imageUrl}
                    alt="Preview"
                    className="h-28 w-full object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Destination Category</label>
                <select
                  className="select-input"
                  value={bannerFormData.targetCategory || 'Repairs and installations'}
                  onChange={(e) =>
                    setBannerFormData({ ...bannerFormData, targetCategory: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Badge Tag</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. HOT OFFER / NEW"
                  value={bannerFormData.badgeText || ''}
                  onChange={(e) =>
                    setBannerFormData({ ...bannerFormData, badgeText: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Placement</label>
                <select
                  className="select-input"
                  value={bannerFormData.placement || 'hero_carousel'}
                  onChange={(e) =>
                    setBannerFormData({ ...bannerFormData, placement: e.target.value as any })
                  }
                >
                  <option value="hero_carousel">Hero Carousel (Top)</option>
                  <option value="mid_feed">Mid-Feed Promotion</option>
                  <option value="category_header">Category Header</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="select-input"
                  value={bannerFormData.isActive ? 'active' : 'draft'}
                  onChange={(e) =>
                    setBannerFormData({
                      ...bannerFormData,
                      isActive: e.target.value === 'active'
                    })
                  }
                >
                  <option value="active">Active & Visible</option>
                  <option value="draft">Draft / Hidden</option>
                </select>
              </div>
            </div>

            <div className="modal-footer-actions mt-6">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIsNewBannerModalOpen(false);
                  setEditingBanner(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveBanner}
                disabled={!bannerFormData.title?.trim()}
              >
                {editingBanner ? 'Update Banner' : 'Publish Banner'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Add / Edit Listing */}
      {(isNewListingModalOpen || editingListing) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsNewListingModalOpen(false);
            setEditingListing(null);
          }}
          title={editingListing ? 'Edit Service Listing' : 'Create New Service Listing'}
          subtitle="Configure pricing, time duration, and warranty commitments."
        >
          <div className="listing-form-body">
            <div className="form-group mb-3">
              <label className="form-label">Service Title</label>
              <input
                type="text"
                className="input-text"
                placeholder="e.g. Split AC Comprehensive Jet Service"
                value={listingFormData.title || ''}
                onChange={(e) => setListingFormData({ ...listingFormData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Parent Category</label>
                <select
                  className="select-input"
                  value={listingFormData.categoryId || categories[0]?.id}
                  onChange={(e) =>
                    setListingFormData({ ...listingFormData, categoryId: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Base Starting Price (₹)</label>
                <input
                  type="number"
                  className="input-text font-bold text-emerald"
                  value={listingFormData.basePrice ?? 499}
                  onChange={(e) =>
                    setListingFormData({
                      ...listingFormData,
                      basePrice: parseFloat(e.target.value) || 0
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Estimated Duration (mins)</label>
                <input
                  type="number"
                  className="input-text"
                  value={listingFormData.durationMinutes ?? 45}
                  onChange={(e) =>
                    setListingFormData({
                      ...listingFormData,
                      durationMinutes: parseInt(e.target.value) || 0
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Warranty Guarantee (Days)</label>
                <input
                  type="number"
                  className="input-text"
                  value={listingFormData.warrantyDays ?? 30}
                  onChange={(e) =>
                    setListingFormData({
                      ...listingFormData,
                      warrantyDays: parseInt(e.target.value) || 0
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Service Scope & Description</label>
              <textarea
                className="textarea-input"
                rows={3}
                placeholder="Detail what is included in this service..."
                value={listingFormData.description || ''}
                onChange={(e) =>
                  setListingFormData({ ...listingFormData, description: e.target.value })
                }
              ></textarea>
            </div>

            <div className="modal-footer-actions mt-6">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIsNewListingModalOpen(false);
                  setEditingListing(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveListing}
                disabled={!listingFormData.title?.trim()}
              >
                {editingListing ? 'Save Changes' : 'Publish Listing'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Add / Edit Category */}
      {(isNewCategoryModalOpen || editingCategory) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsNewCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          title={editingCategory ? 'Edit Category' : 'Create Category'}
          subtitle="Configure platform take-rate % and geofence distribution."
        >
          <div className="category-form-body">
            <div className="form-group mb-3">
              <label className="form-label">Category Name</label>
              <input
                type="text"
                className="input-text"
                placeholder="e.g. Electrical and plumbing"
                value={categoryFormData.name || ''}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="form-group">
                <label className="form-label">Commission Take-Rate (%)</label>
                <input
                  type="number"
                  className="input-text font-bold text-punch-orange"
                  value={categoryFormData.commissionRate ?? 15}
                  onChange={(e) =>
                    setCategoryFormData({
                      ...categoryFormData,
                      commissionRate: parseFloat(e.target.value) || 0
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category Icon</label>
                <select
                  className="select-input"
                  value={categoryFormData.iconName || 'Wrench'}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, iconName: e.target.value })
                  }
                >
                  <option value="Wrench">Wrench (Repairs)</option>
                  <option value="Zap">Zap (Electrical)</option>
                  <option value="Sparkles">Sparkles (Cleaning)</option>
                  <option value="Scissors">Scissors (Tailoring / Beauty)</option>
                  <option value="Camera">Camera (Events)</option>
                  <option value="Users">Users (Help)</option>
                  <option value="Paintbrush">Paintbrush (Home Improv)</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Category Description</label>
              <textarea
                className="textarea-input"
                rows={3}
                placeholder="Brief summary of services grouped under this category..."
                value={categoryFormData.description || ''}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, description: e.target.value })
                }
              ></textarea>
            </div>

            <div className="modal-footer-actions mt-6">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIsNewCategoryModalOpen(false);
                  setEditingCategory(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveCategory}
                disabled={!categoryFormData.name?.trim()}
              >
                Save Category
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
