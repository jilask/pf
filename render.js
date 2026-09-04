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
                'landscape': { label: 'Landscape / Environment', class: 'landscape' },
                'video': { label: 'Video / Motion', class: 'video' }
            };
            const catInfo = catMap[item.category] || { label: item.category || 'General', class: 'general' };
            const isCaseStudy = Array.isArray(item.media) && item.media.length > 0;
            const hasVideoSubItem = isCaseStudy && item.media.some(m => m && (m.type === 'video' || (typeof m.full === 'string' && m.full.endsWith('.mp4')) || m.mediaType === 'video'));
            const isVideo = !isCaseStudy && item.mediaType === 'video';

            // Media type or case-study multi-view count badge(s)
            let mediaBadge = '';
            if (isCaseStudy) {
                const count = item.media.length;
                const countBadge = `<span class="gallery-type-badge case-study" aria-label="${count} items in case study"><span aria-hidden="true">❐</span> ${count} VIEWS</span>`;
                const videoBadge = hasVideoSubItem ? `<span class="gallery-type-badge video" aria-label="Includes video content"><span aria-hidden="true">▶</span> VIDEO</span>` : '';
                mediaBadge = `<div class="gallery-badges-top-right">${countBadge}${videoBadge}</div>`;
            } else if (isVideo) {
                mediaBadge = `<div class="gallery-badges-top-right"><span class="gallery-type-badge video"><span aria-hidden="true">▶</span> VIDEO</span></div>`;
            }

            const featuredBadge = item.featured
                ? `<span class="gallery-featured-badge" aria-label="Featured item"><span aria-hidden="true">★</span> FEATURED</span>`
                : '';

            const altText = `${item.title} - ${catInfo.label} artwork thumbnail`;
            const overlayText = isVideo ? 'PLAY // LIGHTBOX' : 'VIEW // DETAILS';

            // Thumbnail and full asset resolution: support coverThumb / media[0].thumb with fallback
            const thumbSrc = isCaseStudy
                ? (item.coverThumb || (item.media[0] && item.media[0].thumb) || item.thumb || '')
                : (item.thumb || '');

            const fullSrc = isCaseStudy
                ? (item.full || (item.media[0] && item.media[0].full) || thumbSrc)
                : (item.full || thumbSrc);

            // Responsive image source switching with srcset / sizes
            // Supports WebP/AVIF asset pipelines if defined in item data, with SVG/raster fallback
            const isFullAnImage = fullSrc && typeof fullSrc === 'string' && !fullSrc.endsWith('.mp4');
            const srcsetAttr = item.srcset
                ? `srcset="${item.srcset}"`
                : (isFullAnImage && fullSrc !== thumbSrc
                    ? `srcset="${thumbSrc} 400w, ${fullSrc} 800w"`
                    : `srcset="${thumbSrc} 400w"`);

            const sizesAttr = `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`;

            const videoIndicator = isVideo ? `
                <div class="gallery-video-center-indicator" aria-hidden="true">
                    <span class="video-play-glyph">▶</span>
                </div>
            ` : '';

            const cardMediaType = isCaseStudy ? 'case-study' : (item.mediaType || 'image');
            const itemTags = Array.isArray(item.tags)
                ? item.tags
                : (typeof item.tags === 'string' && item.tags.trim() ? [item.tags.trim()] : []);

            return `
                <article class="gallery-card${item.featured ? ' is-featured' : ''}${isVideo ? ' is-video-item' : ''}${isCaseStudy ? ' is-case-study' : ''}" 
                         data-id="${item.id}" 
                         data-category="${item.category}" 
                         data-media-type="${cardMediaType}"
                         role="button" 
                         tabindex="0" 
                         aria-label="${isVideo ? 'Play video' : 'View details'} for ${item.title}" 
                         onclick="window.portfolio && window.portfolio.openGalleryLightbox('${item.id}')" 
                         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); window.portfolio && window.portfolio.openGalleryLightbox('${item.id}');}">
                    <div class="gallery-thumb-wrap skeleton-loading">
                        <img src="${thumbSrc}" 
                             ${srcsetAttr}
                             ${sizesAttr}
                             alt="${altText}" 
                             loading="lazy" 
                             decoding="async"
                             width="400" 
                             height="300" 
                             class="gallery-thumb"
                             onload="this.classList.add('loaded'); if (this.parentElement) this.parentElement.parentElement ? this.parentElement.classList.remove('skeleton-loading') : null;"
                             onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='flex'; if (this.parentElement) this.parentElement.classList.remove('skeleton-loading');">
                        <div class="gallery-fallback" style="display: none;" role="img" aria-label="Image failed to load: ${item.title}">
                            <span class="fallback-icon" aria-hidden="true">⚠️</span>
                            <span class="fallback-code">[ERR 404: NOT_FOUND]</span>
                            <span class="fallback-sub">${item.title}</span>
                        </div>
                        ${featuredBadge}
                        ${mediaBadge}
                        ${videoIndicator}
                        <div class="gallery-thumb-overlay">
                            <span class="view-prompt">${overlayText}</span>
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
                        ${itemTags.length ? `
                            <div class="gallery-tags">
                                ${itemTags.map(tag => `<span class="gallery-tag">#${tag}</span>`).join('')}
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
            const promptRevealMode = portfolio ? !!portfolio.promptRevealMode : true;
            const visibleCount = (portfolio && portfolio.galleryVisibleCount) ? portfolio.galleryVisibleCount : 12;

            const filteredItems = (portfolio && typeof portfolio.getFilteredAndSortedGalleryItems === 'function')
                ? portfolio.getFilteredAndSortedGalleryItems()
                : allItems;

            const visibleItems = filteredItems.slice(0, visibleCount);

            // Extract all unique tags across all items
            const tagSet = new Set();
            allItems.forEach(item => {
                if (Array.isArray(item.tags)) {
                    item.tags.forEach(t => tagSet.add(t));
                } else if (typeof item.tags === 'string' && item.tags.trim()) {
                    tagSet.add(item.tags.trim());
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

            const catalogTotalNote = filteredItems.length !== allItems.length ? ` (total in catalog: ${allItems.length})` : '';

            return `
                <h2 class="section-title"># AI Art & Motion Gallery</h2>
                <div class="terminal-text" style="margin-top: 16px;">
                    <div class="command-output">
                        <span style="color: var(--accent-green);">alij@arch-portfolio</span><span style="color: var(--text-secondary);">:</span><span style="color: var(--accent-blue);">~</span><span style="color: var(--accent-yellow);">$</span> ls gallery/ --filter --sort --paginate
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
                                        class="gallery-filter-btn ${currentCategory === 'landscape' ? 'active' : ''}" 
                                        data-category="landscape" 
                                        aria-pressed="${currentCategory === 'landscape' ? 'true' : 'false'}"
                                        onclick="window.portfolio && window.portfolio.setGalleryCategory('landscape')">
                                    [LANDSCAPE]
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
                        Showing <strong style="color: var(--accent-cyan);">${visibleItems.length}</strong> of <strong style="color: var(--accent-green);">${filteredItems.length}</strong> items${catalogTotalNote}${filterDetails}
                    </div>

                    <!-- Gallery Cards Grid -->
                    <div class="gallery-grid" id="gallery-grid">
                        ${renderGallery(visibleItems, null, { category: currentCategory, tags: selectedTags })}
                    </div>

                    <!-- Gallery Pagination Controls -->
                    <div id="gallery-pagination-wrap" class="gallery-pagination-wrap">
                        ${renderGalleryPagination(filteredItems.length, visibleItems.length)}
                    </div>
                </div>
            `;
        }

        default:
            return '';
    }
}

/**
 * Renders pagination / load-more controls based on filtered vs visible item counts.
 * @param {number} totalFiltered - Total count of matching items
 * @param {number} visibleCount - Count of currently visible items
 * @returns {string} HTML markup string
 */
function renderGalleryPagination(totalFiltered, visibleCount) {
    if (totalFiltered > visibleCount) {
        const remaining = totalFiltered - visibleCount;
        const nextBatch = Math.min(12, remaining);
        return `
            <div class="gallery-load-more-container">
                <button type="button" 
                        id="gallery-load-more-btn" 
                        class="gallery-load-more-btn" 
                        onclick="window.portfolio && window.portfolio.loadMoreGalleryItems()"
                        aria-label="Load ${nextBatch} more items (${remaining} remaining in view)">
                    <span class="load-more-icon" aria-hidden="true">↓</span>
                    <span class="load-more-text">LOAD MORE ARTIFACTS // [${remaining} REMAINING]</span>
                </button>
            </div>
        `;
    }
    if (totalFiltered > 0 && totalFiltered <= visibleCount && totalFiltered >= 8) {
        return `
            <div class="gallery-all-loaded-indicator" role="status">
                <span class="terminal-prompt-char" aria-hidden="true">&gt;</span> ALL MATCHING ARTIFACTS LOADED // [${totalFiltered}/${totalFiltered}]
            </div>
        `;
    }
    return '';
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
        if (containerEl) {
            const target = typeof containerEl === 'string' ? document.querySelector(containerEl) : containerEl;
            if (target) target.innerHTML = gridHtml;
        }
        return gridHtml;
    }

    const list = Array.isArray(items) ? items : [];

    if (list.length === 0) {
        gridHtml = renderGalleryEmptyState(emptyStateOptions);
        if (containerEl) {
            const target = typeof containerEl === 'string' ? document.querySelector(containerEl) : containerEl;
            if (target) target.innerHTML = gridHtml;
        }
        return gridHtml;
    }

    // If containerEl is provided, perform targeted DOM reconciliation to avoid recreating loaded image nodes
    if (containerEl) {
        const target = typeof containerEl === 'string' ? document.querySelector(containerEl) : containerEl;
        if (target) {
            const existingCards = target.querySelectorAll('.gallery-card:not(.skeleton-card)');
            const hasEmptyStateOrSkeleton = target.querySelector('.gallery-empty-state, .skeleton-card') !== null;

            if (existingCards.length > 0 && !hasEmptyStateOrSkeleton) {
                const cardMap = new Map();
                existingCards.forEach(card => {
                    const id = card.getAttribute('data-id');
                    if (id) cardMap.set(id, card);
                });

                const newCardElements = [];
                const tempContainer = document.createElement('div');

                list.forEach(item => {
                    if (cardMap.has(item.id)) {
                        newCardElements.push(cardMap.get(item.id));
                    } else {
                        tempContainer.innerHTML = renderCard(item, 'gallery_item');
                        const newCard = tempContainer.firstElementChild;
                        if (newCard) newCardElements.push(newCard);
                    }
                });

                if (typeof target.replaceChildren === 'function') {
                    target.replaceChildren(...newCardElements);
                } else {
                    target.innerHTML = '';
                    newCardElements.forEach(el => target.appendChild(el));
                }
                return '';
            } else {
                gridHtml = list.map(item => renderCard(item, 'gallery_item')).join('');
                target.innerHTML = gridHtml;
                return gridHtml;
            }
        }
    }

    gridHtml = list.map(item => renderCard(item, 'gallery_item')).join('');
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

/**
 * Renders the interactive terminal arcade directory menu (styled like ls -la ~/arcade).
 * @param {Object} arcadeData - Metadata and games list
 * @returns {string} HTML markup string
 */
function renderArcadeMenu(arcadeData) {
    const games = (arcadeData && arcadeData.games) ? arcadeData.games : [];
    const header = (arcadeData && arcadeData.header) ? arcadeData.header : {
        directory: '~/arcade',
        command: 'ls -la arcade/',
        total: games.length,
        user: 'alij',
        group: 'staff',
        date: 'Sep 04'
    };

    const gamesRows = games.map((game) => {
        const badgeText = game.badge || (game.status === 'coming_soon' ? 'COMING SOON' : 'PLAYABLE');
        const badgeClass = game.status === 'coming_soon' ? 'arcade-badge-soon' : 'arcade-badge-active';
        return `
            <button class="arcade-game-row" type="button" data-game-id="${game.id}" aria-label="Launch ${game.title} executable: ${game.executable}. Status: ${badgeText}. ${game.description}">
                <div class="arcade-col-perms" aria-hidden="true">${game.permissions || '-rwxr-xr-x'}</div>
                <div class="arcade-col-owner" aria-hidden="true">${header.user || 'alij'} ${header.group || 'staff'}</div>
                <div class="arcade-col-size" aria-hidden="true">${game.size || '4.0K'}</div>
                <div class="arcade-col-date" aria-hidden="true">${header.date || 'Sep 04'}</div>
                <div class="arcade-col-name">
                    <span class="arcade-exec-icon" aria-hidden="true">⚙</span>
                    <span class="arcade-exec-name">${game.executable || `${game.id}.sh`}*</span>
                    <span class="arcade-game-title">(${game.title})</span>
                </div>
                <div class="arcade-col-badge">
                    <span class="arcade-badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="arcade-col-action" aria-hidden="true">
                    <span class="arcade-action-btn">[RUN]</span>
                </div>
            </button>
        `;
    }).join('');

    return `
        <div class="arcade-menu-container">
            <div class="arcade-terminal-prompt">
                <span class="user">${header.user || 'alij'}@portfolio</span><span class="separator">:</span><span class="path">${header.directory || '~/arcade'}</span><span class="prompt">$</span>
                <span class="arcade-typed-cmd">${header.command || 'ls -la arcade/'}</span>
            </div>
            
            <div class="arcade-listing-header">
                <div class="arcade-total-info">total ${games.length} file(s) (workspace 5 kernel sandbox)</div>
                <div class="arcade-table-headers" aria-hidden="true">
                    <span class="arcade-th perms">PERMISSIONS</span>
                    <span class="arcade-th owner">OWNER</span>
                    <span class="arcade-th size">SIZE</span>
                    <span class="arcade-th date">DATE</span>
                    <span class="arcade-th name">EXECUTABLE // PROGRAM</span>
                    <span class="arcade-th badge">STATUS</span>
                    <span class="arcade-th action">ACTION</span>
                </div>
            </div>

            <div class="arcade-games-list" role="list" aria-label="Arcade Executables Directory">
                ${gamesRows}
            </div>

            <div class="arcade-directory-footer">
                <div class="arcade-terminal-tip">
                    <span class="arcade-tip-icon" aria-hidden="true">ℹ</span>
                    <span>Select an executable using <strong>Tab / Click</strong> and press <strong>[Enter]</strong> to stage process.</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renders the detailed view/placeholder for a selected arcade game.
 * @param {Object} game - Game metadata object
 * @returns {string} HTML markup string
 */
function renderArcadeGamePlaceholder(game) {
    if (!game) {
        return `<div class="arcade-placeholder-error">Error: Game executable not found.</div>`;
    }

    const asciiLines = Array.isArray(game.asciiArt) ? game.asciiArt.join('\n') : '';
    const controls = Array.isArray(game.controlsPreview) ? game.controlsPreview : [];

    const controlsHtml = controls.map(c => `
        <div class="arcade-control-item">
            <kbd class="arcade-key-badge">${c.key}</kbd>
            <span class="arcade-control-action">${c.action}</span>
        </div>
    `).join('');

    return `
        <div class="arcade-game-detail-container" role="region" aria-label="${game.title} details and status">
            <div class="arcade-detail-nav">
                <button class="arcade-back-btn" id="arcade-back-to-menu-btn" type="button" aria-label="Back to arcade executables directory">
                    <span aria-hidden="true">←</span> cd .. (Back to Arcade Menu) <span class="arcade-key-hint" aria-hidden="true">[ESC]</span>
                </button>
                <div class="arcade-process-status">
                    <span class="arcade-pulse-dot" aria-hidden="true"></span>
                    <span class="arcade-status-text">PID: 7701 // STATUS: STAGED_FOR_DEPLOYMENT</span>
                </div>
            </div>

            <div class="arcade-placeholder-content">
                <div class="arcade-header-block">
                    <div class="arcade-executable-meta">
                        <span class="arcade-meta-tag">EXE: ./${game.executable}</span>
                        <span class="arcade-meta-tag">VER: ${game.version || 'v0.1.0-alpha'}</span>
                        <span class="arcade-meta-tag">GENRE: ${game.genre || 'Terminal Arcade'}</span>
                    </div>
                    ${asciiLines ? `<pre class="arcade-ascii-art" aria-hidden="true">${asciiLines}</pre>` : ''}
                    <h3 class="arcade-game-headline">${game.title} - Terminal Arcade</h3>
                    <p class="arcade-game-summary">${game.description}</p>
                </div>

                <div class="arcade-stage-notice">
                    <div class="arcade-notice-badge">
                        <span class="arcade-notice-icon" aria-hidden="true">⏳</span>
                        <span>DEPLOYMENT STAGE: COMING SOON</span>
                    </div>
                    <p class="arcade-notice-desc">
                        Process binary <code>./${game.executable}</code> is currently being compiled in kernel sandbox. The full interactive terminal simulation will launch in the next sprint deployment.
                    </p>
                </div>

                <div class="arcade-preview-section">
                    <h4 class="arcade-section-title">// PLANNED INPUT MAPPINGS</h4>
                    <div class="arcade-controls-grid">
                        ${controlsHtml}
                    </div>
                </div>

                <div class="arcade-preview-section">
                    <h4 class="arcade-section-title">// SYSTEM ENVIRONMENT</h4>
                    <div class="arcade-env-specs">
                        <div class="arcade-spec-item">
                            <span class="arcade-spec-label">Terminal Renderer:</span>
                            <span class="arcade-spec-val">HTML5 Canvas / Fixed-grid CharBuffer</span>
                        </div>
                        <div class="arcade-spec-item">
                            <span class="arcade-spec-label">Audio Engine:</span>
                            <span class="arcade-spec-val">WebAudio Synthesized Retro Chiptune Bleeps</span>
                        </div>
                        <div class="arcade-spec-item">
                            <span class="arcade-spec-label">Tick Rate:</span>
                            <span class="arcade-spec-val">10 Hz (Classic 100ms cycle)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

if (typeof window !== 'undefined') {
    window.renderCard = renderCard;
    window.renderSection = renderSection;
    window.renderGallery = renderGallery;
    window.renderGalleryPagination = renderGalleryPagination;
    window.renderProjectDetails = renderProjectDetails;
    window.renderArcadeMenu = renderArcadeMenu;
    window.renderArcadeGamePlaceholder = renderArcadeGamePlaceholder;
}

