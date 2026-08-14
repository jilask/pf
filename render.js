// Componentized rendering functions for retro tiling-WM portfolio

/**
 * Renders a single UI component card/item based on data shape and component type.
 * @param {Object|string} item - Data item to render
 * @param {string} type - Card/item type ('project', 'experience', 'achievement', 'metric', 'skill_bar', 'contact_link', 'status_tag', 'tech_tag')
 * @returns {string} HTML markup string
 */
function renderCard(item, type) {
    switch (type) {
        case 'project':
            return `
                <button class="portfolio-item" type="button" onclick="window.portfolio.showProject('${item.id}')" aria-label="${item.title}: ${item.description}. View project details.">
                    <div class="portfolio-image" aria-hidden="true">${item.image ? `<img src="${item.image}" alt="${item.title}" loading="lazy">` : item.icon}</div>
                    <div class="portfolio-content">
                        <h3 class="portfolio-title">${item.title}</h3>
                        <div class="portfolio-description">${item.description}</div>
                        <div style="margin-top: 8px; color: var(--accent-blue); font-size: 10px;">View project details →</div>
                    </div>
                </button>
            `;

        case 'experience':
            return `
                <article class="experience-item">
                    <h3 class="job-title">${item.title}</h3>
                    <div class="company" style="color: ${item.companyColor}; font-weight: 600;">${item.company}</div>
                    <div class="duration">${item.duration}</div>
                    <div class="job-description">
                        ${item.bullets.map((bullet, idx) => {
                            const isLast = idx === item.bullets.length - 1;
                            return `<div${isLast ? '' : ' style="margin-bottom: 4px;"'}><span style="color: var(--accent-green);" aria-hidden="true">→</span> ${bullet}</div>`;
                        }).join('')}
                    </div>
                </article>
            `;

        case 'achievement':
            return `
                <div style="color: ${item.titleColor}; margin-bottom: 8px;">${item.status} ${item.icon} ${item.title}</div>
                <div style="padding-left: 16px; color: var(--text-secondary); margin-bottom: 12px; font-size: 12px;">
                    ${item.description}
                </div>
            `;

        case 'metric':
            return `
                <div>
                    <div style="color: ${item.color}; font-size: 20px; font-weight: 600;">${item.value}</div>
                    <div style="color: var(--text-dim); font-size: 10px;">${item.label}</div>
                </div>
            `;

        case 'skill_bar':
            return `
                <div style="margin-bottom: 8px;">
                    <span style="color: var(--accent-cyan);">${item.name}:</span>
                    <div class="progress-bar" style="margin-top: 4px;" role="progressbar" aria-valuenow="${item.percentage}" aria-valuemin="0" aria-valuemax="100" aria-label="${item.name} proficiency">
                        <div class="progress-fill" style="width: ${item.percentage}%;"></div>
                    </div>
                    <span style="color: var(--text-dim); font-size: 10px;">${item.percentage}%</span>
                </div>
            `;

        case 'contact_link':
            return `
                <a href="${item.url}"${item.target ? ` target="${item.target}"` : ''} class="contact-item" aria-label="${item.label}: ${item.value}">
                    <div class="contact-icon" aria-hidden="true">${item.icon}</div>
                    <div class="contact-label">${item.label}</div>
                    <div class="contact-value">${item.value}</div>
                </a>
            `;

        case 'status_tag':
            return `<span style="background: ${item.bg}; padding: 4px 12px; border-radius: 12px; font-size: 10px; color: ${item.color}; border: 1px solid ${item.color};">${item.text}</span>`;

        case 'tech_tag': {
            const name = typeof item === 'string' ? item : item.name;
            const bg = (typeof item === 'object' && item.bg) ? item.bg : 'rgba(152, 195, 121, 0.2)';
            const color = (typeof item === 'object' && item.color) ? item.color : 'var(--accent-green)';
            return `<span style="background: ${bg}; padding: 4px 8px; border-radius: 12px; font-size: 10px; color: ${color}; border: 1px solid ${color};">${name}</span>`;
        }

        case 'gallery_item': {
            const catMap = {
                'fashion': { label: 'Fashion / Commercial', class: 'fashion' },
                'character': { label: 'Character / Stylized', class: 'character' },
                'video': { label: 'Video / Motion', class: 'video' }
            };
            const catInfo = catMap[item.category] || { label: item.category || 'General', class: 'general' };
            const mediaBadge = item.mediaType === 'video' ? `<span class="gallery-type-badge">VIDEO</span>` : '';
            const featuredBadge = item.featured
                ? `<span class="gallery-featured-badge" aria-label="Featured item"><span aria-hidden="true">★</span> FEATURED</span>`
                : '';

            const altText = `${item.title} - ${catInfo.label} artwork thumbnail`;

            return `
                <article class="gallery-card${item.featured ? ' is-featured' : ''}" 
                         data-id="${item.id}" 
                         data-category="${item.category}" 
                         role="button" 
                         tabindex="0" 
                         aria-label="View details for ${item.title}" 
                         onclick="window.portfolio && window.portfolio.openGalleryLightbox('${item.id}')" 
                         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); window.portfolio && window.portfolio.openGalleryLightbox('${item.id}');}">
                    <div class="gallery-thumb-wrap skeleton-loading">
                        <img src="${item.thumb}" 
                             alt="${altText}" 
                             loading="lazy" 
                             width="400" 
                             height="300" 
                             class="gallery-thumb"
                             onload="this.classList.add('loaded'); if (this.parentElement) this.parentElement.classList.remove('skeleton-loading');"
                             onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='flex'; if (this.parentElement) this.parentElement.classList.remove('skeleton-loading');">
                        <div class="gallery-fallback" style="display: none;" role="img" aria-label="Image failed to load: ${item.title}">
                            <span class="fallback-icon" aria-hidden="true">⚠️</span>
                            <span class="fallback-code">[ERR 404: NOT_FOUND]</span>
                            <span class="fallback-sub">${item.title}</span>
                        </div>
                        ${featuredBadge}
                        ${mediaBadge}
                        <div class="gallery-thumb-overlay">
                            <span class="view-prompt">VIEW // DETAILS</span>
                        </div>
                    </div>
                    <div class="gallery-info">
                        <div class="gallery-header-line">
                            <h3 class="gallery-title">${item.title}</h3>
                            <span class="gallery-category-badge ${catInfo.class}">${catInfo.label}</span>
                        </div>
                        <div class="gallery-meta">
                            <span class="gallery-tool">${item.tool || ''}</span>
                            <span class="gallery-date">${item.date || ''}</span>
                        </div>
                        ${item.tags && item.tags.length ? `
                            <div class="gallery-tags">
                                ${item.tags.map(tag => `<span class="gallery-tag">#${tag}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </article>
            `;
        }

        default:
            return '';
    }
}

/**
 * Renders a complete section view based on section type and data payload.
 * @param {string} sectionType - 'about', 'skills', 'experience', 'achievements', 'portfolio', 'contact'
 * @param {Object} data - Section data object loaded from JSON
 * @returns {string} HTML markup string
 */
function renderSection(sectionType, data) {
    if (!data) {
        return `<div class="terminal-text" style="color: var(--accent-red); margin-top: 16px;">[ERROR] Failed to load data for section: ${sectionType}</div>`;
    }

    switch (sectionType) {
        case 'about':
            return `
                <h2 class="section-title typewriter"># About Me</h2>
                <div class="terminal-text" style="margin-top: 16px;">
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> whoami
                    </div>
                    <p style="margin: 12px 0; font-size: 14px;">
                        <span style="color: var(--accent-cyan);">${data.name}</span> - ${data.title}
                    </p>
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat location.txt
                    </div>
                    <p style="margin: 8px 0; color: var(--text-secondary);">${data.location}</p>
                    
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat bio.md
                    </div>
                    <div style="margin: 12px 0; padding: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 6px; border-left: 3px solid var(--accent-blue);">
                        ${data.bio.map(paragraph => `<p style="margin-bottom: 12px; line-height: 1.6;">${paragraph}</p>`).join('')}
                    </div>
                    
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat current_focus.json
                    </div>
                    <div style="margin: 12px 0; padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 11px;">
                        <div style="color: var(--text-secondary);">{</div>
                        <div style="margin-left: 16px;">
                            <span style="color: var(--accent-cyan);">"focus_areas"</span><span style="color: var(--text-secondary);">: [</span>
                            <div style="margin-left: 16px;">
                                ${data.focus_areas.map((area, index) => {
                                    const isLast = index === data.focus_areas.length - 1;
                                    return `<div><span style="color: var(--accent-green);">"${area}"</span>${isLast ? '' : '<span style="color: var(--text-secondary);">,</span>'}</div>`;
                                }).join('')}
                            </div>
                            <span style="color: var(--text-secondary);">]</span>
                        </div>
                        <div style="color: var(--text-secondary);">}</div>
                    </div>
                </div>
            `;

        case 'skills':
            return `
                <h2 class="section-title"># Technical Skills</h2>
                <div class="terminal-text" style="margin-top: 16px;">
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat skills.json | jq .
                    </div>
                    <div style="margin: 12px 0; padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 11px;">
                        <div style="color: var(--text-secondary);">{</div>
                        <div style="margin-left: 16px;">
                            <div style="margin-bottom: 8px;">
                                <span style="color: var(--accent-cyan);">"generative_ai"</span><span style="color: var(--text-secondary);">: {</span>
                                <div style="margin-left: 16px; color: var(--accent-green);">
                                    "tools": [${data.jq_data.generative_ai.tools.map(t => `"${t}"`).join(', ')}],<br>
                                    "models": [${data.jq_data.generative_ai.models.map(m => `"${m}"`).join(', ')}],<br>
                                    "proficiency": <span style="color: var(--accent-orange);">${data.jq_data.generative_ai.proficiency}</span>
                                </div>
                                <span style="color: var(--text-secondary);">},</span>
                            </div>
                            <div style="margin-bottom: 8px;">
                                <span style="color: var(--accent-cyan);">"programming"</span><span style="color: var(--text-secondary);">: {</span>
                                <div style="margin-left: 16px; color: var(--accent-green);">
                                    "languages": [${data.jq_data.programming.languages.map(l => `"${l}"`).join(', ')}],<br>
                                    "frameworks": [${data.jq_data.programming.frameworks.map(f => `"${f}"`).join(', ')}],<br>
                                    "proficiency": <span style="color: var(--accent-orange);">${data.jq_data.programming.proficiency}</span>
                                </div>
                                <span style="color: var(--text-secondary);">},</span>
                            </div>
                            <div style="margin-bottom: 8px;">
                                <span style="color: var(--accent-cyan);">"ai_workflows"</span><span style="color: var(--text-secondary);">: {</span>
                                <div style="margin-left: 16px; color: var(--accent-green);">
                                    "specialties": [${data.jq_data.ai_workflows.specialties.map(s => `"${s}"`).join(', ')}],<br>
                                    "deployment": [${data.jq_data.ai_workflows.deployment.map(d => `"${d}"`).join(', ')}],<br>
                                    "proficiency": <span style="color: var(--accent-orange);">${data.jq_data.ai_workflows.proficiency}</span>
                                </div>
                                <span style="color: var(--text-secondary);">}</span>
                            </div>
                        </div>
                        <div style="color: var(--text-secondary);">}</div>
                    </div>
                    
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> ./skill_proficiency.sh
                    </div>
                    <div style="margin: 12px 0;">
                        ${data.proficiency_bars.map(bar => renderCard(bar, 'skill_bar')).join('')}
                    </div>
                </div>
            `;

        case 'experience':
            return `
                <h2 class="section-title"># Professional Experience</h2>
                <div class="terminal-text" style="margin-top: 16px;">
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat experience.log
                    </div>
                    
                    ${data.entries.map(entry => renderCard(entry, 'experience')).join('')}
                    
                    <div class="command-output" style="margin-top: 16px;">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> echo "${data.total_experience}"
                    </div>
                    <div style="color: var(--accent-cyan); margin: 8px 0;">${data.total_experience}</div>
                </div>
            `;

        case 'achievements':
            return `
                <h2 class="section-title"># Key Achievements</h2>
                <div class="terminal-text" style="margin-top: 16px;">
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat achievements.txt
                    </div>
                    
                    <div style="margin: 12px 0;">
                        ${data.achievements.map(ach => renderCard(ach, 'achievement')).join('')}
                    </div>
                    
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> ./impact_metrics.sh
                    </div>
                    
                    <div style="margin: 12px 0; padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 6px;">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; text-align: center;">
                            ${data.impact_metrics.map(metric => renderCard(metric, 'metric')).join('')}
                        </div>
                    </div>
                </div>
            `;

        case 'portfolio':
            return `
                <h2 class="section-title"># Projects & Portfolio</h2>
                <div class="terminal-text" style="margin-top: 16px;">
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> ls -la projects/
                    </div>
                    
                    <div style="margin: 12px 0; font-family: 'Fira Code', monospace; font-size: 11px;">
                        <div style="color: var(--text-secondary); margin-bottom: 8px;">total ${data.ls_projects.length}</div>
                        <div style="display: grid; gap: 4px;">
                            ${data.ls_projects.map(item => `
                                <div style="display: grid; grid-template-columns: auto auto auto 1fr; gap: 8px; align-items: center;">
                                    <span style="color: var(--accent-blue);">drwxr-xr-x</span>
                                    <span style="color: var(--text-secondary);">2</span>
                                    <span style="color: var(--accent-green);">alij</span>
                                    <span style="color: var(--accent-cyan);">${item}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="portfolio-grid" style="margin-top: 16px;">
                        ${data.projects.map(project => renderCard(project, 'project')).join('')}
                    </div>
                    
                    <div class="command-output" style="margin-top: 16px;">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat tech_stack.txt
                    </div>
                    <div style="margin: 12px 0; display: flex; flex-wrap: wrap; gap: 6px;">
                        ${data.tech_stack.map(tech => renderCard(tech, 'tech_tag')).join('')}
                    </div>
                </div>
            `;

        case 'contact':
            return `
                <h2 class="section-title"># Contact Information</h2>
                <div class="terminal-text" style="margin-top: 16px;">
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> contact --info
                    </div>
                    
                    <div style="margin: 12px 0; padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 11px;">
                        <div style="color: var(--text-secondary);"># Contact Details</div>
                        <div style="margin: 8px 0;">
                            <span style="color: var(--accent-cyan);">EMAIL:</span> <span style="color: var(--accent-green);">${data.email}</span>
                        </div>
                        <div style="margin: 8px 0;">
                            <span style="color: var(--accent-cyan);">PHONE:</span> <span style="color: var(--accent-green);">${data.phone}</span>
                        </div>
                        <div style="margin: 8px 0;">
                            <span style="color: var(--accent-cyan);">LOCATION:</span> <span style="color: var(--accent-green);">${data.location}</span>
                        </div>
                        <div style="margin: 8px 0;">
                            <span style="color: var(--accent-cyan);">TIMEZONE:</span> <span style="color: var(--accent-green);">${data.timezone}</span>
                        </div>
                    </div>
                    
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> cat social_links.txt
                    </div>
                    
                    <div class="contact-grid" style="margin-top: 12px;">
                        ${data.social_links.map(link => renderCard(link, 'contact_link')).join('')}
                    </div>
                    
                    <div class="command-output" style="margin-top: 16px;">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> echo "Status: Available for collaboration"
                    </div>
                    <div style="margin: 12px 0; text-align: center; padding: 16px; background: rgba(97, 175, 239, 0.1); border-radius: 6px; border: 1px solid var(--accent-blue);">
                        <div style="color: var(--accent-cyan); font-weight: 600; margin-bottom: 8px;">Let's Connect!</div>
                        <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 12px;">
                            I'm always interested in discussing AI projects, prompt engineering challenges, and innovative technology solutions.
                        </div>
                        <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
                            ${data.status_tags.map(tag => renderCard(tag, 'status_tag')).join('')}
                        </div>
                    </div>
                </div>
            `;

        case 'gallery': {
            const allItems = Array.isArray(data) ? data : (data && data.items ? data.items : []);
            const portfolio = (typeof window !== 'undefined') ? window.portfolio : null;
            const currentCategory = (portfolio && portfolio.galleryFilterCategory) ? portfolio.galleryFilterCategory : 'all';
            const selectedTags = (portfolio && portfolio.gallerySelectedTags) ? Array.from(portfolio.gallerySelectedTags) : [];
            const currentSort = (portfolio && portfolio.gallerySortOption) ? portfolio.gallerySortOption : 'date-desc';
            const promptRevealMode = portfolio ? !!portfolio.promptRevealMode : false;

            const displayItems = (portfolio && typeof portfolio.getFilteredAndSortedGalleryItems === 'function')
                ? portfolio.getFilteredAndSortedGalleryItems()
                : allItems;

            // Extract all unique tags across all items
            const tagSet = new Set();
            allItems.forEach(item => {
                if (Array.isArray(item.tags)) {
                    item.tags.forEach(t => tagSet.add(t));
                }
            });
            const allTags = Array.from(tagSet);

            const hasActiveFilters = currentCategory !== 'all' || selectedTags.length > 0;
            let filterDetails = '';
            if (hasActiveFilters) {
                const parts = [];
                if (currentCategory !== 'all') parts.push(`category: ${currentCategory}`);
                if (selectedTags.length > 0) parts.push(`tags: ${selectedTags.map(t => '#' + t).join(', ')}`);
                filterDetails = ` [filtered by ${parts.join(' & ')}]`;
            }

            return `
                <h2 class="section-title"># AI Art & Motion Gallery</h2>
                <div class="terminal-text" style="margin-top: 16px;">
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> ls gallery/ --filter --sort
                    </div>

                    <!-- Gallery Controls Bar -->
                    <div class="gallery-controls-container" role="toolbar" aria-label="Gallery filters and sorting controls">
                        <div class="gallery-controls-top-row">
                            <!-- Category Filter Segment -->
                            <div class="gallery-filter-bar" role="group" aria-label="Filter by category">
                                <span class="controls-section-label"><span class="terminal-prompt-char">&gt;</span> CAT:</span>
                                <button type="button" 
                                        class="gallery-filter-btn ${currentCategory === 'all' ? 'active' : ''}" 
                                        data-category="all" 
                                        aria-pressed="${currentCategory === 'all' ? 'true' : 'false'}"
                                        onclick="window.portfolio && window.portfolio.setGalleryCategory('all')">
                                    [ALL]
                                </button>
                                <button type="button" 
                                        class="gallery-filter-btn ${currentCategory === 'fashion' ? 'active' : ''}" 
                                        data-category="fashion" 
                                        aria-pressed="${currentCategory === 'fashion' ? 'true' : 'false'}"
                                        onclick="window.portfolio && window.portfolio.setGalleryCategory('fashion')">
                                    [FASHION]
                                </button>
                                <button type="button" 
                                        class="gallery-filter-btn ${currentCategory === 'character' ? 'active' : ''}" 
                                        data-category="character" 
                                        aria-pressed="${currentCategory === 'character' ? 'true' : 'false'}"
                                        onclick="window.portfolio && window.portfolio.setGalleryCategory('character')">
                                    [CHARACTER]
                                </button>
                                <button type="button" 
                                        class="gallery-filter-btn ${currentCategory === 'video' ? 'active' : ''}" 
                                        data-category="video" 
                                        aria-pressed="${currentCategory === 'video' ? 'true' : 'false'}"
                                        onclick="window.portfolio && window.portfolio.setGalleryCategory('video')">
                                    [VIDEO]
                                </button>
                            </div>

                            <!-- Right Controls: Sort & Prompt Reveal Toggle -->
                            <div class="gallery-controls-right">
                                <!-- Sort Dropdown -->
                                <div class="gallery-sort-wrap">
                                    <label for="gallery-sort-select" class="controls-section-label">
                                        <span class="terminal-prompt-char">&gt;</span> SORT:
                                    </label>
                                    <select id="gallery-sort-select" 
                                            class="gallery-sort-select" 
                                            aria-label="Sort gallery items"
                                            onchange="window.portfolio && window.portfolio.setGallerySort(this.value)">
                                        <option value="date-desc" ${currentSort === 'date-desc' ? 'selected' : ''}>📅 Date (Newest)</option>
                                        <option value="featured-first" ${currentSort === 'featured-first' ? 'selected' : ''}>★ Featured first</option>
                                        <option value="date-asc" ${currentSort === 'date-asc' ? 'selected' : ''}>📅 Date (Oldest)</option>
                                        <option value="title-asc" ${currentSort === 'title-asc' ? 'selected' : ''}>🔤 Title (A-Z)</option>
                                    </select>
                                </div>

                                <!-- Prompt Reveal Toggle Switch -->
                                <div class="gallery-reveal-toggle-wrap">
                                    <label class="gallery-reveal-toggle" title="Toggle prompt guessing mode: conceal prompts in viewer behind a reveal button">
                                        <input type="checkbox" 
                                               id="prompt-reveal-checkbox" 
                                               ${promptRevealMode ? 'checked' : ''}
                                               onchange="window.portfolio && window.portfolio.togglePromptRevealMode(this.checked)"
                                               aria-label="Prompt Reveal Mode: hide prompts initially in lightbox">
                                        <span class="toggle-slider" aria-hidden="true"></span>
                                        <span class="toggle-text"><span class="toggle-icon">👁️</span> Guess Mode</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Tag Filter Chips Row -->
                        <div class="gallery-tags-filter-bar" role="group" aria-label="Filter by tags">
                            <span class="controls-section-label"><span class="terminal-prompt-char">&gt;</span> TAGS:</span>
                            <div class="gallery-tags-list">
                                ${allTags.map(tag => {
                                    const isSelected = selectedTags.includes(tag);
                                    return `
                                        <button type="button" 
                                                class="gallery-tag-chip ${isSelected ? 'active' : ''}" 
                                                data-tag="${tag}" 
                                                aria-pressed="${isSelected ? 'true' : 'false'}"
                                                onclick="window.portfolio && window.portfolio.toggleGalleryTag('${tag}')">
                                            #${tag}
                                        </button>
                                    `;
                                }).join('')}
                                <button type="button" 
                                        id="clear-filters-btn" 
                                        class="gallery-clear-filters-btn" 
                                        onclick="window.portfolio && window.portfolio.resetGalleryFilters()"
                                        style="${hasActiveFilters ? '' : 'display: none;'}"
                                        aria-label="Clear active category and tag filters">
                                    ✕ Clear filters
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Items Count & Status Info Line -->
                    <div id="gallery-count-status" class="gallery-count-status" aria-live="polite">
                        Showing <strong style="color: var(--accent-cyan);">${displayItems.length}</strong> of <strong style="color: var(--accent-green);">${allItems.length}</strong> items${filterDetails}
                    </div>

                    <!-- Gallery Cards Grid -->
                    <div class="gallery-grid" id="gallery-grid">
                        ${renderGallery(displayItems, null, { category: currentCategory, tags: selectedTags })}
                    </div>
                </div>
            `;
        }

        default:
            return '';
    }
}

/**
 * Renders an empty state view when no items match current filter criteria.
 * @param {Object} [options] - Filter state options
 * @returns {string} HTML markup string
 */
function renderGalleryEmptyState(options) {
    const category = (options && options.category && options.category !== 'all') ? options.category : null;
    const tags = (options && Array.isArray(options.tags) && options.tags.length > 0) ? options.tags : null;

    return `
        <div class="gallery-empty-state" role="status" aria-label="No items match your active filters">
            <div class="empty-terminal-header">
                <span class="empty-dot red"></span>
                <span class="empty-dot yellow"></span>
                <span class="empty-dot green"></span>
                <span class="empty-header-title">QUERY // [0 MATCHES]</span>
            </div>
            <div class="empty-body">
                <div class="empty-cmd-line">
                    <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~/gallery</span><span style="color: var(--accent-yellow);">$</span> find . -type f -matches "active_filters"
                </div>
                <div class="empty-status-code">[ERR_404: NO_MATCHING_ARTIFACTS]</div>
                <h3 class="empty-title">$ no results found for current filters</h3>
                <div class="empty-desc">
                    Zero artwork or motion items matched the active filter combination:
                    <div class="empty-active-filters">
                        ${category ? `<span class="empty-tag">category: <code>"${category}"</code></span>` : ''}
                        ${tags ? `<span class="empty-tag">tags: <code>[${tags.map(t => '#' + t).join(', ')}]</code></span>` : ''}
                    </div>
                </div>
                <button type="button" 
                        class="gallery-reset-btn" 
                        onclick="window.portfolio && window.portfolio.resetGalleryFilters()"
                        aria-label="Clear active filters and show all items">
                    <span aria-hidden="true">↺</span> CLEAR FILTERS // SHOW ALL ITEMS
                </button>
            </div>
        </div>
    `;
}

/**
 * Renders gallery grid items into containerEl or returns HTML markup string.
 * @param {Array|null} items - List of gallery items, or null if loading
 * @param {HTMLElement|string} [containerEl] - Target container element or selector
 * @param {Object} [emptyStateOptions] - Options for empty state if items is empty
 * @returns {string} HTML markup string
 */
function renderGallery(items, containerEl, emptyStateOptions) {
    let gridHtml = '';

    if (items === null || items === undefined) {
        // Render loading skeleton cards before data has loaded
        const skeletonCardHtml = `
            <article class="gallery-card skeleton-card">
                <div class="gallery-thumb-wrap skeleton-loading"></div>
                <div class="gallery-info">
                    <div class="skeleton-line skeleton-title-line skeleton-loading"></div>
                    <div class="skeleton-line skeleton-meta-line skeleton-loading"></div>
                </div>
            </article>
        `;
        gridHtml = Array(6).fill(skeletonCardHtml).join('');
    } else {
        const list = Array.isArray(items) ? items : [];
        gridHtml = list.length > 0
            ? list.map(item => renderCard(item, 'gallery_item')).join('')
            : renderGalleryEmptyState(emptyStateOptions);
    }

    if (containerEl) {
        const target = typeof containerEl === 'string' ? document.querySelector(containerEl) : containerEl;
        if (target) {
            target.innerHTML = gridHtml;
        }
    }
    return gridHtml;
}

/**
 * Renders details section for a selected project.
 * @param {Object} project - Project object from projects data
 * @returns {string} HTML markup string
 */
function renderProjectDetails(project) {
    if (!project) return '<div>Project not found</div>';

    return `
        <h2 class="section-title"># ${project.detailTitle || project.title}</h2>
        <div class="terminal-text" style="margin-top: 16px;">
            <div style="margin-bottom: 16px;">
                <button type="button" onclick="window.portfolio.loadSection('portfolio')" aria-label="Back to Portfolio projects list" style="
                    background: rgba(97, 175, 239, 0.2); 
                    border: 1px solid var(--accent-blue); 
                    color: var(--accent-blue); 
                    padding: 6px 12px; 
                    border-radius: 4px; 
                    font-family: 'Fira Code', monospace; 
                    font-size: 11px; 
                    cursor: pointer;
                    transition: all 0.2s ease;
                " onmouseover="this.style.background='rgba(97, 175, 239, 0.3)'" onmouseout="this.style.background='rgba(97, 175, 239, 0.2)'">
                    ← Back to Portfolio
                </button>
            </div>
            <div class="command-output">
                <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~/projects</span><span style="color: var(--accent-yellow);">$</span> ${project.readmeCommand}
            </div>
            <div style="margin: 16px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border-radius: 6px; border-left: 3px solid ${project.borderLeftColor};">
                <h3 style="color: var(--accent-cyan); margin-bottom: 12px;">${project.icon} ${project.detailTitle || project.title}</h3>
                <p style="margin-bottom: 12px; line-height: 1.6;">
                    ${project.intro}
                </p>
                <div style="margin-bottom: 16px;">
                    <h4 class="project-subsection-title">${project.featuresHeader}</h4>
                    <ul style="list-style: none; padding: 0;">
                        ${project.features.map(f => `<li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> ${f}</li>`).join('')}
                    </ul>
                </div>
                <div style="margin-bottom: 16px;">
                    <h4 class="project-subsection-title">Technologies Used:</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${project.technologies.map(tech => renderCard({ name: tech, bg: project.techStyle.bg, color: project.techStyle.color }, 'tech_tag')).join('')}
                    </div>
                </div>
                <div>
                    <h4 class="project-subsection-title">${project.impactHeader}</h4>
                    <p style="color: var(--text-secondary); font-size: 12px; line-height: 1.5;">
                        ${project.impactText}
                    </p>
                </div>
            </div>
        `;
}

if (typeof window !== 'undefined') {
    window.renderCard = renderCard;
    window.renderSection = renderSection;
    window.renderGallery = renderGallery;
    window.renderProjectDetails = renderProjectDetails;
}
