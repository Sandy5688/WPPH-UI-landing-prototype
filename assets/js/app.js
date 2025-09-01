/**
 * Content Display UI - Lightweight JavaScript Application
 * Features: API integration, search, filtering, lazy loading, content sanitization
 */

class ContentDisplayUI {
    constructor() {
        // Configuration
        this.config = {
            apiUrl: 'https://68b43ecb45c90167876fdf56.mockapi.io/api/v1/posts',
            itemsPerPage: 6,
            searchDebounceMs: 300,
            adFrequency: 5 // Show ad every 5th content item
        };

        // State
        this.content = [];
        this.filteredContent = [];
        this.currentPage = 0;
        this.isLoading = false;
        this.ads = [];
        this.branding = {};
        
        // DOM Elements
        this.contentGrid = document.getElementById('contentGrid');
        this.searchInput = document.getElementById('searchInput');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.sortFilter = document.getElementById('sortFilter');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the application
     */
    async init() {
        this.bindEvents();
        await this.loadContent();
        this.populateCategories();
        this.renderContent();
        
        // Pass ads data to AdManager if available
        if (window.adManager && this.ads.length > 0) {
            window.adManager.setAds(this.ads);
        }
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Search functionality with debouncing
        this.searchInput.addEventListener('input', this.debounce(() => {
            this.filterContent();
        }, this.config.searchDebounceMs));
        
        // Filter functionality
        this.categoryFilter.addEventListener('change', () => {
            this.filterContent();
        });
        
        this.sortFilter.addEventListener('change', () => {
            this.filterContent();
        });
        
        // Load more functionality
        this.loadMoreBtn.addEventListener('click', () => {
            this.loadMore();
        });
    }
    
    /**
     * Debounce utility function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Load content from API
     */
    async loadContent() {
        try {
            this.isLoading = true;
            this.showLoading();
            
            const response = await fetch(this.config.apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Handle the MockAPI structure where each item has posts, ads, and branding
            if (Array.isArray(data) && data.length > 0) {
                // Find the first item that has posts, ads, and branding
                const itemWithData = data.find(item => item.posts && item.ads && item.branding);
                
                if (itemWithData) {
                    this.content = itemWithData.posts || [];
                    this.ads = itemWithData.ads || [];
                    this.branding = itemWithData.branding || {};
                } else {
                    // Fallback: treat the array as posts
                    this.content = data;
                    this.ads = [];
                    this.branding = {};
                }
            } else if (data && typeof data === 'object') {
                // Direct object format
                this.content = data.posts || [];
                this.ads = data.ads || [];
                this.branding = data.branding || {};
            } else {
                // Fallback
                this.content = [];
                this.ads = [];
                this.branding = {};
            }
            
            this.filteredContent = [...this.content];
            
            // Apply branding if available
            this.applyBranding();
            
        } catch (error) {
            console.error('Error loading content:', error);
            this.showError('Failed to load content. Please try again.');
        } finally {
            this.isLoading = false;
        }
    }
    
    /**
     * Populate category filter dropdown
     */
    populateCategories() {
        const categories = [...new Set(this.content.map(item => item.category))];
        categories.sort();
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            this.categoryFilter.appendChild(option);
        });
    }
    
    /**
     * Filter and sort content
     */
    filterContent() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        const selectedCategory = this.categoryFilter.value;
        const sortBy = this.sortFilter.value;
        
        this.filteredContent = this.content.filter(item => {
            const matchesSearch = !searchTerm || 
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm);
            
            const matchesCategory = !selectedCategory || item.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
        
        // Sort content
        this.sortContent(sortBy);
        
        // Reset pagination and re-render
        this.currentPage = 0;
        this.renderContent();
    }
    
    /**
     * Sort content by criteria
     */
    sortContent(sortBy) {
        switch (sortBy) {
            case 'newest':
                this.filteredContent.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'popular':
                this.filteredContent.sort((a, b) => b.views - a.views);
                break;
            default:
                this.filteredContent.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    }
    
    /**
     * Render content with pagination
     */
    renderContent() {
        const startIndex = 0;
        const endIndex = (this.currentPage + 1) * this.config.itemsPerPage;
        const contentToShow = this.filteredContent.slice(startIndex, endIndex);
        
        // Clear content only on first page or when filtering
        if (this.currentPage === 0) {
            this.contentGrid.innerHTML = '';
        }
        
        if (contentToShow.length === 0 && this.currentPage === 0) {
            this.showNoResults();
            return;
        }
        
        // Add new content to existing content
        contentToShow.forEach((item, index) => {
            const card = this.createContentCard(item);
            this.contentGrid.appendChild(card);
            
            // Add inline ad every 5th item (based on total items shown)
            const totalItemsShown = this.currentPage * this.config.itemsPerPage + index + 1;
            if (totalItemsShown % this.config.adFrequency === 0) {
                const adElement = this.createInlineAd();
                this.contentGrid.appendChild(adElement);
            }
        });
        
        // Update load more button
        this.updateLoadMoreButton();
    }
    
    /**
     * Create content card element
     */
    createContentCard(item) {
        const card = document.createElement('article');
        card.className = 'content-card fade-in';
        
        // Sanitize content to prevent XSS
        const sanitizedTitle = this.sanitizeHTML(item.title);
        const sanitizedDescription = this.sanitizeHTML(item.description);
        const sanitizedCategory = this.sanitizeHTML(item.category);
        
        card.innerHTML = `
            <div class="card-thumbnail">
                <a href="${this.sanitizeHTML(item.link)}" class="card-thumbnail-link" target="_blank" rel="noopener">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23334155'/%3E%3C/svg%3E" 
                         data-src="${this.sanitizeHTML(item.thumbnail)}" 
                         alt="${sanitizedTitle}"
                         class="lazy-image"
                         loading="lazy">
                </a>
            </div>
            <div class="card-content">
                <span class="card-category">${sanitizedCategory}</span>
                <a href="${this.sanitizeHTML(item.link)}" class="card-title" target="_blank" rel="noopener">
                    ${sanitizedTitle}
                </a>
                <p class="card-description">${sanitizedDescription}</p>
                <div class="card-meta">
                    <span>${this.formatDate(item.date)}</span>
                    <span>${item.views.toLocaleString()} views</span>
                </div>
            </div>
        `;
        
        // Initialize lazy loading for images
        this.initLazyLoading(card);
        
        return card;
    }
    
    /**
     * Create inline ad element
     */
    createInlineAd() {
        const adElement = document.createElement('div');
        adElement.className = 'listed-ad';
        
        // Find appropriate inline ad from ads array
        const inlineAd = this.ads.find(ad => ad.slot.startsWith('inline_'));
        
        if (inlineAd) {
            adElement.innerHTML = `
                <a href="${this.sanitizeHTML(inlineAd.click_url)}" target="_blank" rel="noopener" class="ad-link">
                    <img src="${this.sanitizeHTML(inlineAd.image_url)}" 
                         alt="${this.sanitizeHTML(inlineAd.alt_text)}"
                         class="ad-image"
                         loading="lazy">
                </a>
            `;
        } else {
            adElement.innerHTML = `
                <div class="ad-placeholder">
                    <span>Inline Ad Banner (728×120)</span>
                    <small>Replace with your ad code</small>
                </div>
            `;
        }
        
        return adElement;
    }
    
    /**
     * Apply branding to the page
     */
    applyBranding() {
        if (!this.branding || Object.keys(this.branding).length === 0) {
            return;
        }
        
        // Update logo
        const logo = document.querySelector('.logo');
        if (logo && this.branding.logo_url) {
            logo.innerHTML = `<img src="${this.sanitizeHTML(this.branding.logo_url)}" alt="${this.sanitizeHTML(this.branding.company_name || 'Logo')}" class="logo-image">`;
        } else if (logo && this.branding.company_name) {
            logo.textContent = this.branding.company_name;
        }
        
        // Apply brand colors
        if (this.branding.primary_color) {
            document.documentElement.style.setProperty('--primary-color', this.branding.primary_color);
        }
        if (this.branding.secondary_color) {
            document.documentElement.style.setProperty('--secondary-color', this.branding.secondary_color);
        }
        if (this.branding.accent_color) {
            document.documentElement.style.setProperty('--accent-color', this.branding.accent_color);
        }
    }
    
    /**
     * Initialize lazy loading for images
     */
    initLazyLoading(card) {
        const images = card.querySelectorAll('.lazy-image');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.onload = () => {
                        img.classList.add('loaded');
                    };
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    /**
     * Load more content
     */
    loadMore() {
        this.currentPage++;
        this.renderContent();
    }
    
    /**
     * Update load more button state
     */
    updateLoadMoreButton() {
        const hasMoreContent = (this.currentPage + 1) * this.config.itemsPerPage < this.filteredContent.length;
        this.loadMoreBtn.disabled = !hasMoreContent;
        this.loadMoreBtn.textContent = hasMoreContent ? 'Load More' : 'No More Content';
    }
    
    /**
     * Show loading state
     */
    showLoading() {
        this.contentGrid.innerHTML = '<div class="loading">Loading content...</div>';
    }
    
    /**
     * Show error state
     */
    showError(message) {
        this.contentGrid.innerHTML = `<div class="loading">${message}</div>`;
    }
    
    /**
     * Show no results state
     */
    showNoResults() {
        this.contentGrid.innerHTML = `
            <div class="loading">
                <p>No content found matching your criteria.</p>
                <p>Try adjusting your search or filters.</p>
            </div>
        `;
    }
    
    /**
     * Sanitize HTML to prevent XSS attacks
     */
    sanitizeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }
}

/**
 * Ad Management System
 */
class AdManager {
    constructor() {
        this.adSlots = {
            header: '.ad-header',
            sidebar: '.ad-sidebar',
            inline: '.inline-ad',
            footer: '.ad-footer',
            mobile: '.ad-mobile'
        };
        this.ads = [];
    }
    
    /**
     * Set ads data
     */
    setAds(ads) {
        this.ads = ads || [];
        this.renderAds();
    }
    
    /**
     * Render all ads based on available ad data
     */
    renderAds() {
        // Header ad
        const headerAd = this.ads.find(ad => ad.slot === 'banner_top');
        if (headerAd) {
            this.replaceAd('.ad-header', this.createAdHTML(headerAd));
        }
        
        // Footer ad
        const footerAd = this.ads.find(ad => ad.slot === 'banner_footer');
        if (footerAd) {
            this.replaceAd('.ad-footer', this.createAdHTML(footerAd));
        }
        
        // Sidebar ads
        const sidebarAds = this.ads.filter(ad => ad.slot.startsWith('sidebar_'));
        if (sidebarAds.length > 0) {
            const sidebarContainer = document.querySelector('.ad-sidebar');
            if (sidebarContainer) {
                sidebarContainer.innerHTML = '';
                sidebarAds.forEach(ad => {
                    const adElement = document.createElement('div');
                    adElement.className = 'sidebar-ad-item';
                    adElement.innerHTML = this.createAdHTML(ad);
                    sidebarContainer.appendChild(adElement);
                });
            }
        }
        
        // Mobile ad
        const mobileAd = this.ads.find(ad => ad.slot === 'mobile_banner');
        if (mobileAd) {
            this.replaceAd('.ad-mobile', this.createAdHTML(mobileAd));
        }
    }
    
    /**
     * Create HTML for an ad
     */
    createAdHTML(ad) {
        return `
            <a href="${ad.click_url}" target="_blank" rel="noopener" class="ad-link">
                <img src="${ad.image_url}" 
                     alt="${ad.alt_text || 'Advertisement'}"
                     class="ad-image"
                     loading="lazy">
            </a>
        `;
    }
    
    /**
     * Replace ad placeholder with actual ad code
     */
    replaceAd(selector, adCode) {
        const adElement = document.querySelector(selector);
        if (adElement) {
            adElement.innerHTML = adCode;
        }
    }
    
    /**
     * Replace all ads with provided ad codes
     */
    replaceAllAds(adCodes) {
        Object.keys(adCodes).forEach(slot => {
            if (this.adSlots[slot] && adCodes[slot]) {
                this.replaceAd(this.adSlots[slot], adCodes[slot]);
            }
        });
    }
}

/**
 * Initialize application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main application
    const app = new ContentDisplayUI();
    
    // Initialize ad manager
    const adManager = new AdManager();
    
    // Make app globally accessible for debugging
    window.contentApp = app;
    window.adManager = adManager;
});

/**
 * Utility functions for external use
 */
window.ContentDisplayUI = {
    // Replace ad slot with custom ad code
    replaceAd: (slot, adCode) => {
        if (window.adManager) {
            window.adManager.replaceAd(window.adManager.adSlots[slot], adCode);
        }
    },
    
    // Replace all ads at once
    replaceAllAds: (adCodes) => {
        if (window.adManager) {
            window.adManager.replaceAllAds(adCodes);
        }
    },
    
    // Refresh content
    refreshContent: () => {
        if (window.contentApp) {
            window.contentApp.loadContent();
        }
    }
};
