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
                <div class="portfolio-item" onclick="window.portfolio.showProject('${item.id}')">
                    <div class="portfolio-image">${item.icon}</div>
                    <div class="portfolio-content">
                        <div class="portfolio-title">${item.title}</div>
                        <div class="portfolio-description">${item.description}</div>
                        <div style="margin-top: 8px; color: var(--accent-blue); font-size: 10px;">Click to view details →</div>
                    </div>
                </div>
            `;

        case 'experience':
            return `
                <div class="experience-item">
                    <div class="job-title">${item.title}</div>
                    <div class="company" style="color: ${item.companyColor}; font-weight: 600;">${item.company}</div>
                    <div class="duration">${item.duration}</div>
                    <div class="job-description">
                        ${item.bullets.map((bullet, idx) => {
                            const isLast = idx === item.bullets.length - 1;
                            return `<div${isLast ? '' : ' style="margin-bottom: 4px;"'}><span style="color: var(--accent-green);">→</span> ${bullet}</div>`;
                        }).join('')}
                    </div>
                </div>
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
                    <div class="progress-bar" style="margin-top: 4px;">
                        <div class="progress-fill" style="width: ${item.percentage}%;"></div>
                    </div>
                    <span style="color: var(--text-dim); font-size: 10px;">${item.percentage}%</span>
                </div>
            `;

        case 'contact_link':
            return `
                <a href="${item.url}"${item.target ? ` target="${item.target}"` : ''} class="contact-item">
                    <div class="contact-icon">${item.icon}</div>
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
                <div class="section-title typewriter"># About Me</div>
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
                <div class="section-title"># Technical Skills</div>
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
                <div class="section-title"># Professional Experience</div>
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
                <div class="section-title"># Key Achievements</div>
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
                <div class="section-title"># Projects & Portfolio</div>
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
                <div class="section-title"># Contact Information</div>
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

        default:
            return '';
    }
}

/**
 * Renders details section for a selected project.
 * @param {Object} project - Project object from projects data
 * @returns {string} HTML markup string
 */
function renderProjectDetails(project) {
    if (!project) return '<div>Project not found</div>';

    return `
        <div class="section-title"># ${project.detailTitle || project.title}</div>
        <div class="terminal-text" style="margin-top: 16px;">
            <div style="margin-bottom: 16px;">
                <button onclick="window.portfolio.loadSection('portfolio')" style="
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
                    <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">${project.featuresHeader}</div>
                    <ul style="list-style: none; padding: 0;">
                        ${project.features.map(f => `<li style="margin-bottom: 6px;"><span style="color: var(--accent-green);">✓</span> ${f}</li>`).join('')}
                    </ul>
                </div>
                <div style="margin-bottom: 16px;">
                    <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">Technologies Used:</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${project.technologies.map(tech => renderCard({ name: tech, bg: project.techStyle.bg, color: project.techStyle.color }, 'tech_tag')).join('')}
                    </div>
                </div>
                <div>
                    <div style="color: var(--accent-yellow); font-weight: 600; margin-bottom: 8px;">${project.impactHeader}</div>
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
    window.renderProjectDetails = renderProjectDetails;
}
