// DOM elements
const promptInput = document.getElementById('prompt');
const enhancePromptBtn = document.getElementById('enhancePromptBtn');
const suggestionsContainer = document.getElementById('suggestionsContainer');
const loadingElement = document.getElementById('loading');
const loadingDetails = document.getElementById('loadingDetails');
const advancedPanel = document.getElementById('advancedPanel');
const nsfwToggle = document.getElementById('nsfwToggle');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const gallery = document.getElementById('gallery');
const emptyState = document.getElementById('emptyState');
const seedInput = document.getElementById('seed');
const multiImageGrid = document.getElementById('multi-image-grid');
const generateMultiBtn = document.getElementById('generate-multi-btn');
const regenerateButton = document.getElementById('regenerate-button');
const generateBtn = document.getElementById('generate-btn');
const resetBtn = document.getElementById('reset-btn');
const clearGalleryBtn = document.getElementById('clear-gallery-btn');
const downloadAllBtn = document.getElementById('download-all-btn');
const notificationClose = document.getElementById('notificationClose');
const advancedHeader = document.querySelector('.advanced-header');

// Initialize theme from localStorage or prefer-color-scheme
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.documentElement.classList.add('light-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.documentElement.classList.remove('light-mode');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

// Toggle theme
function toggleTheme() {
    if (document.documentElement.classList.contains('light-mode')) {
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
}

// Generate random seed
function generateRandomSeed() {
    return Math.floor(Math.random() * 1000000000);
}

// Regenerate image with same prompt but different seed
function regenerateImage() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        showNotification('Please generate an image first before regenerating', false);
        return;
    }
    
    // Generate and set a new random seed
    seedInput.value = generateRandomSeed();
    
    // Generate new image with same prompt but different seed
    generateImage();
}

// Toggle advanced panel
function toggleAdvancedPanel() {
    advancedPanel.classList.toggle('open');
}

// Show prompt suggestions
function showSuggestions() {
    if (promptInput.value.trim() === '') {
        suggestionsContainer.classList.add('visible');
    }
}

function hideSuggestions() {
    setTimeout(() => {
        suggestionsContainer.classList.remove('visible');
    }, 200);
}

// Insert suggestion into prompt
function insertSuggestion(text) {
    const currentPrompt = promptInput.value.trim();
    if (currentPrompt) {
        promptInput.value = currentPrompt + ', ' + text;
    } else {
        promptInput.value = text;
    }
    promptInput.focus();
    suggestionsContainer.classList.remove('visible');
}

// Enhance prompt function
async function enhancePrompt() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        showNotification('Please enter a prompt to enhance', false);
        return;
    }
    
    try {
        // Show loading
        enhancePromptBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        enhancePromptBtn.style.pointerEvents = 'none';
        
        // Simulate API call to enhance prompt
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Enhanced prompt examples (in a real app, this would come from an API)
        const enhancements = [
            'ultra detailed, 8k resolution, professional photography, intricate details',
            'cinematic lighting, dramatic atmosphere, highly detailed, artstation trending',
            'concept art, digital painting, vivid colors, fantasy art, trending on artstation',
            'brutalist architecture, raw concrete aesthetic, geometric forms, stark shadows',
            'hyper-realistic, indistinguishable from photography, ultra high detail',
            'macabre atmosphere, eerie and unsettling, gothic influences',
            'moulting effect, decaying textures, surreal transformation'
        ];
        
        const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
        promptInput.value = prompt + ', ' + randomEnhancement;
        
        showNotification('Prompt enhanced successfully!');
        
    } catch (error) {
        console.error('Error enhancing prompt:', error);
        showNotification('Failed to enhance prompt', false);
    } finally {
        enhancePromptBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i>';
        enhancePromptBtn.style.pointerEvents = 'auto';
    }
}

// Reset form function
function resetForm() {
    promptInput.value = '';
    document.getElementById('negative-prompt').value = '';
    document.getElementById('model').value = 'stable-diffusion-xl';
    document.getElementById('style').value = 'realistic';
    document.getElementById('effect').value = '';
    document.getElementById('seed').value = '';
    document.getElementById('steps').value = 50;
    document.getElementById('cfg-scale').value = 7;
    document.getElementById('quality').value = 1;
    nsfwToggle.checked = false;
    
    // Reset to default ratio
    const ratioBtns = document.querySelectorAll('.ratio-btn');
    ratioBtns.forEach(b => b.classList.remove('active'));
    document.querySelector('.ratio-btn[data-ratio="1:1"]').classList.add('active');
    
    // Close advanced panel if open
    advancedPanel.classList.remove('open');
    
    showNotification('Form reset to default values');
}

// Show notification function
function showNotification(message, isSuccess = true) {
    const notification = document.getElementById('notification');
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationContent = document.getElementById('notificationContent');
    
    // Set notification content
    notificationContent.textContent = message;
    
    // Set icon and style based on type
    if (isSuccess) {
        notification.className = 'notification success show';
        notificationIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    } else {
        notification.className = 'notification error show';
        notificationIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    }
    
    // Auto-hide after 5 seconds
    setTimeout(hideNotification, 5000);
}

// Hide notification function
function hideNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show');
}

// Update loading details
function updateLoadingDetails(message) {
    loadingDetails.textContent = message;
    loadingDetails.scrollTop = loadingDetails.scrollHeight;
}

// Generate multiple images with different styles
async function generateImages(isRegenerate = false) {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        showNotification('Please enter a prompt first');
        return;
    }

    // Show loading state
    const imageItems = multiImageGrid.querySelectorAll('.image-item');
    imageItems.forEach(item => {
        item.innerHTML = '<div class="loading" style="width: 30px; height: 30px;"></div>';
    });

    generateMultiBtn.disabled = true;
    regenerateButton.disabled = true;

    if (isRegenerate) {
        regenerateButton.innerHTML = '<div class="loading" style="width: 16px; height: 16px;"></div>';
    } else {
        generateMultiBtn.innerHTML = '<div class="loading" style="width: 16px; height: 16px;"></div>';
    }

    try {
        // Get selected model and aspect ratio
        const model = document.getElementById('model').value;
        const ratio = document.getElementById('aspect-ratio').value;
        
        // Map aspect ratio to width and height parameters
        let width, height;
        switch(ratio) {
            case '1:1':
                width = 1024;  // Increased resolution
                height = 1024;
                break;
            case '9:16':
                width = 768;
                height = 1365;
                break;
            case '16:9':
                width = 1365;
                height = 768;
                break;
            case '4:3':
                width = 1024;
                height = 768;
                break;
            case '3:4':
                width = 768;
                height = 1024;
                break;
            default:
                width = 1024;
                height = 1024;
        }

        // Define different artistic styles for each image with high quality parameters
        const styles = [
            { 
                name: "Realistic", 
                promptAddition: "highly detailed, photorealistic, 8k, ultra HD, intricate details, professional photography, sharp focus, HDR, 64 megapixels" 
            },
            { 
                name: "Painting", 
                promptAddition: "masterpiece, oil painting style, brush strokes, artistic, impressionist, highly detailed, artstation trending, 4k" 
            },
            { 
                name: "Anime", 
                promptAddition: "anime style, vibrant colors, cel-shaded, Studio Ghibli inspired, 4k resolution, ultra detailed, trending on pixiv" 
            },
            { 
                name: "Cyberpunk", 
                promptAddition: "cyberpunk style, neon lights, futuristic, sci-fi, Blade Runner inspired, 8k, ultra detailed, cinematic lighting" 
            }
        ];

        // Show multi-image grid and hide single image gallery
        multiImageGrid.style.display = 'grid';
        gallery.style.display = 'none';
        emptyState.style.display = 'none';

        // Generate 4 images with different styles
        for (let i = 0; i < imageItems.length; i++) {
            const style = styles[i];
            const enhancedPrompt = `${prompt}, ${style.promptAddition}`;
            
            // Generate a random seed for each image to ensure different results
            const randomSeed = generateRandomSeed();
            
            // Use Pollinations.AI image generation with high quality parameters
            const encodedPrompt = encodeURIComponent(enhancedPrompt);
            let apiUrl;
            
            // Additional parameters for high quality
            const qualityParams = `width=${width}&height=${height}&nologo=true&seed=${randomSeed}&steps=50&cfg_scale=12&upscale=true`;
            
            if (model === 'default') {
                apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${qualityParams}`;
            } else {
                apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=${model}&${qualityParams}`;
            }
            
            // Create image element
            const img = document.createElement('img');
            img.src = apiUrl;
            img.alt = enhancedPrompt;
            img.loading = "lazy"; // Loading optimization
            
            // Create download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const timestamp = Date.now();
                const filename = `rizqi-o-ai-${style.name.toLowerCase()}-${timestamp}.jpg`;
                downloadImage(apiUrl, filename);
            });
            
            // Create style info
            const styleInfo = document.createElement('div');
            styleInfo.className = 'image-info';
            styleInfo.textContent = style.name;
            
            // Replace the content of the image item
            imageItems[i].innerHTML = '';
            imageItems[i].appendChild(img);
            imageItems[i].appendChild(styleInfo);
            imageItems[i].appendChild(downloadBtn);
            
            // Add hover effect for download button
            imageItems[i].addEventListener('mouseenter', () => {
                downloadBtn.style.opacity = '1';
            });
            
            imageItems[i].addEventListener('mouseleave', () => {
                downloadBtn.style.opacity = '0';
            });
        }
        
        // Enable buttons
        generateMultiBtn.disabled = false;
        regenerateButton.disabled = false;
        
        if (isRegenerate) {
            regenerateButton.innerHTML = '<i class="fas fa-rotate"></i> Regenerate';
        } else {
            generateMultiBtn.innerHTML = '<i class="fas fa-images"></i> Generate 4 Styles';
        }
        
        // Show success notification
        showNotification('4 high quality images with different styles generated successfully!');
    } catch (error) {
        console.error('Error:', error);
        multiImageGrid.innerHTML = `
            <div class="image-item">
                <p>Failed to generate image. Please try again.</p>
            </div>
            <div class="image-item">
                <p>Failed to generate image. Please try again.</p>
            </div>
            <div class="image-item">
                <p>Failed to generate image. Please try again.</p>
            </div>
            <div class="image-item">
                <p>Failed to generate image. Please try again.</p>
            </div>
        `;
        generateMultiBtn.disabled = false;
        regenerateButton.disabled = false;
        generateMultiBtn.innerHTML = '<i class="fas fa-images"></i> Generate 4 Styles';
        regenerateButton.innerHTML = '<i class="fas fa-rotate"></i> Regenerate';
        showNotification('Error generating images', false);
    }
}

// Image generation
async function generateImage() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        showNotification('Please enter a prompt to generate an image', false);
        return;
    }
    
    const negativePrompt = document.getElementById('negative-prompt').value.trim();
    const model = document.getElementById('model').value;
    const style = document.getElementById('style').value;
    const effect = document.getElementById('effect').value;
    const ratio = document.getElementById('aspect-ratio').value;
    let seed = document.getElementById('seed').value;
    const steps = document.getElementById('steps').value;
    const cfgScale = document.getElementById('cfg-scale').value;
    const quality = document.getElementById('quality').value;
    const isNSFW = nsfwToggle.checked;
    
    // Map aspect ratio to width and height
    let width, height;
    switch(ratio) {
        case '1:1':
            width = 1024;
            height = 1024;
            break;
        case '9:16':
            width = 768;
            height = 1365;
            break;
        case '16:9':
            width = 1365;
            height = 768;
            break;
        case '4:3':
            width = 1024;
            height = 768;
            break;
        case '3:4':
            width = 768;
            height = 1024;
            break;
        default:
            width = 1024;
            height = 1024;
    }
    
    // If seed is empty, generate a random one
    if (!seed) {
        seed = generateRandomSeed();
        document.getElementById('seed').value = seed;
    }
    
    const loading = document.getElementById('loading');
    const generateBtn = document.getElementById('generate-btn');
    
    // Show loading state
    loading.style.display = 'flex';
    generateBtn.disabled = true;
    
    // Simulate loading steps
    updateLoadingDetails('Initializing AI model...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    updateLoadingDetails('Processing your prompt...');
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    updateLoadingDetails('Generating image (step 1/' + steps + ')...');
    
    // Simulate progress updates
    let progress = 1;
    const progressInterval = setInterval(() => {
        progress++;
        if (progress <= steps) {
            updateLoadingDetails('Generating image (step ' + progress + '/' + steps + ')...');
            
            // Random details to make it feel realistic
            if (progress % 5 === 0) {
                const details = [
                    'Refining textures...',
                    'Adjusting lighting...',
                    'Adding details...',
                    'Optimizing colors...',
                    'Applying style...',
                    'Finalizing composition...'
                ];
                updateLoadingDetails(details[Math.floor(Math.random() * details.length)]);
            }
        }
    }, 100);
    
    if (emptyState.style.display !== 'none') {
        emptyState.style.display = 'none';
    }
    
    // Hide multi-image grid and show single image gallery
    multiImageGrid.style.display = 'none';
    gallery.style.display = 'grid';
    
    try {
        // Construct the enhanced prompt with all parameters
        let fullPrompt = prompt;
        
        // Add style if selected
        if (style) {
            fullPrompt += `, ${style} style`;
        }
        
        // Add effect if selected
        if (effect) {
            fullPrompt += `, ${effect} effect`;
        }
        
        // Add quality enhancements based on quality slider
        let qualityDescriptor = '';
        if (quality >= 1.5) {
            qualityDescriptor = 'ultra high detail, 8k resolution, professional photography, intricate details';
        } else if (quality >= 1) {
            qualityDescriptor = 'high detail, 4k resolution, professional';
        } else {
            qualityDescriptor = 'good quality';
        }
        
        fullPrompt += `, ${qualityDescriptor}`;
        
        // Add NSFW tag if enabled
        if (isNSFW) {
            fullPrompt += `, nsfw`;
        }
        
        // Add model info
        fullPrompt += `, ${model} model`;
        
        // Add negative prompt if exists
        if (negativePrompt) {
            fullPrompt += ` | negative: ${negativePrompt}`;
        }
        
        // Add seed if provided
        if (seed) {
            fullPrompt += ` | seed: ${seed}`;
        }
        
        // Add steps and cfg scale
        fullPrompt += ` | steps: ${steps}`;
        fullPrompt += ` | cfg: ${cfgScale}`;
        
        // API URL with all parameters
        const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&quality=${quality}&nologo=true`;
        
        // Create image element
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        // Create card HTML
        const card = document.createElement('div');
        card.className = 'image-card fade-in';
        if (isNSFW) {
            card.classList.add('nsfw');
        }
        
        const timestamp = Date.now();
        const filename = `rizqi-o-ai-pro-${timestamp}.jpg`;
        
        card.innerHTML = `
            ${isNSFW ? '<div class="nsfw-badge">NSFW</div>' : ''}
            <img src="${apiUrl}" alt="${fullPrompt}" loading="lazy">
            <div class="image-info">
                <div class="image-prompt" title="${fullPrompt.replace(/"/g, '&quot;')}">${fullPrompt.length > 100 ? fullPrompt.substring(0, 100) + '...' : fullPrompt}</div>
                <div class="image-actions">
                    <button class="action-btn ${isNSFW ? 'nsfw' : ''}" title="Download" onclick="downloadImage('${apiUrl}', '${filename}')">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn ${isNSFW ? 'nsfw' : ''}" title="Share" onclick="shareImage('${apiUrl}', '${fullPrompt.replace(/'/g, "\\'")}')">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="action-btn ${isNSFW ? 'nsfw' : ''}" title="Enhance" onclick="enhanceImage('${apiUrl}', '${fullPrompt.replace(/'/g, "\\'")}')">
                        <i class="fas fa-wand-magic-sparkles"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Clear gallery before adding new image
        while (gallery.firstChild) {
            gallery.removeChild(gallery.firstChild);
        }
        
        // Add to gallery
        gallery.appendChild(card);
        
        // When image loads
        img.onload = () => {
            clearInterval(progressInterval);
            loading.style.display = 'none';
            generateBtn.disabled = false;
            showNotification('Image generated successfully!');
            
            // Add animation to new card
            card.classList.add('fade-in');
            if (isNSFW) {
                card.classList.add('nsfw-pulse');
            }
        };
        
        img.onerror = () => {
            clearInterval(progressInterval);
            loading.style.display = 'none';
            generateBtn.disabled = false;
            showNotification('Failed to generate image. Please try again.', false);
        };
        
        img.src = apiUrl;
        
    } catch (error) {
        console.error('Error:', error);
        clearInterval(progressInterval);
        loading.style.display = 'none';
        generateBtn.disabled = false;
        showNotification('An error occurred. Please try again.', false);
    }
}

// Download function
async function downloadImage(url, filename) {
    const downloadLoading = document.createElement('div');
    downloadLoading.className = 'loading';
    downloadLoading.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <p class="loading-subtitle">Preparing download...</p>
        </div>
    `;
    document.body.appendChild(downloadLoading);
    
    try {
        // Fetch the image
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Show download success notification
        showNotification('Image downloaded successfully!');
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
            document.body.removeChild(downloadLoading);
        }, 100);
        
    } catch (error) {
        console.error('Download error:', error);
        document.body.removeChild(downloadLoading);
        showNotification('Download failed: ' + error.message, false);
    }
}

// Share function
function shareImage(url, prompt) {
    if (navigator.share) {
        navigator.share({
            title: 'Rizqi O AI Generated Image',
            text: prompt,
            url: url
        }).then(() => {
            showNotification('Image shared successfully!');
        }).catch(err => {
            console.log('Share failed:', err);
            copyToClipboard(url);
        });
    } else {
        copyToClipboard(url);
    }
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification('Image URL copied to clipboard!');
        })
        .catch(err => {
            console.error('Copy failed:', err);
            showNotification('Failed to copy to clipboard', false);
        });
}

// Enhance existing image
function enhanceImage(url, prompt) {
    promptInput.value = prompt + ', enhanced, ultra detailed, 8k resolution';
    showNotification('Prompt enhanced from existing image. Click Generate to create improved version.');
    promptInput.focus();
}

// Clear gallery
function clearGallery() {
    const gallery = document.getElementById('gallery');
    const multiImageGrid = document.getElementById('multi-image-grid');
    
    if ((gallery.children.length > 0 && !gallery.querySelector('.empty-state')) || 
        (multiImageGrid.style.display !== 'none')) {
        if (confirm('Are you sure you want to clear all generated images?')) {
            // Clear single image gallery
            while (gallery.firstChild) {
                gallery.removeChild(gallery.firstChild);
            }
            
            // Clear multi-image grid
            const imageItems = multiImageGrid.querySelectorAll('.image-item');
            imageItems.forEach(item => {
                item.innerHTML = '';
            });
            
            emptyState.style.display = 'flex';
            multiImageGrid.style.display = 'none';
            gallery.style.display = 'grid';
            showNotification('Gallery cleared');
        }
    } else {
        showNotification('Gallery is already empty', false);
    }
}

// Download all images
function downloadAllImages() {
    // Check single image gallery
    const singleImages = document.querySelectorAll('.gallery .image-card img');
    // Check multi-image grid
    const multiImages = document.querySelectorAll('.multi-image-grid .image-item img');
    
    const allImages = [...singleImages, ...multiImages];
    
    if (allImages.length === 0) {
        showNotification('No images to download', false);
        return;
    }
    
    showNotification(`Preparing to download ${allImages.length} images...`);
    
    // In a real app, you would zip all images and provide a single download
    // For this demo, we'll just trigger downloads for each image
    setTimeout(() => {
        allImages.forEach((img, index) => {
            const style = img.closest('.image-item') ? 
                img.closest('.image-item').querySelector('.image-info').textContent.toLowerCase() : 
                'pro';
            const filename = `rizqi-o-ai-${style}-${Date.now()}-${index + 1}.jpg`;
            setTimeout(() => {
                downloadImage(img.src, filename);
            }, index * 1000); // Stagger downloads
        });
    }, 1000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Theme toggle event
    themeToggle.addEventListener('click', toggleTheme);
    
    // Prompt input events
    promptInput.addEventListener('focus', showSuggestions);
    promptInput.addEventListener('blur', hideSuggestions);
    promptInput.addEventListener('input', () => {
        if (promptInput.value.trim() === '') {
            suggestionsContainer.classList.add('visible');
        } else {
            suggestionsContainer.classList.remove('visible');
        }
    });
    
    // Suggestion items
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const text = item.textContent;
            insertSuggestion(text);
        });
    });
    
    // Enhance prompt button
    enhancePromptBtn.addEventListener('click', enhancePrompt);
    
    // Advanced panel toggle
    advancedHeader.addEventListener('click', toggleAdvancedPanel);
    
    // Generate buttons
    generateBtn.addEventListener('click', generateImage);
    generateMultiBtn.addEventListener('click', generateImages);
    regenerateButton.addEventListener('click', () => {
        if (multiImageGrid.style.display === 'grid') {
            generateImages(true);
        } else {
            regenerateImage();
        }
    });
    
    // Reset button
    resetBtn.addEventListener('click', resetForm);
    
    // Gallery actions
    clearGalleryBtn.addEventListener('click', clearGallery);
    downloadAllBtn.addEventListener('click', downloadAllImages);
    
    // Notification close
    notificationClose.addEventListener('click', hideNotification);
    
    // Handle Enter key in textarea
    promptInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateImage();
        }
    });
    
    // Add structured data for better SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Rizqi O AI Image Generator Pro",
        "description": "Professional-grade AI image generation with advanced controls and prompt enhancement",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "creator": {
            "@type": "Organization",
            "name": "Rizqi O AI Tools"
        }
    });
    document.head.appendChild(script);
});
