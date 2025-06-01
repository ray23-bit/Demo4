 class VideoPromptGenerator {
  constructor() {
    this.initUI();
    this.setupEventListeners();
    this.loadPresets();
  }

  initUI() {
    // Create main container
    this.container = document.createElement('div');
    this.container.className = 'prompt-generator-container';

    // Create title
    const title = document.createElement('h1');
    title.textContent = 'AI Video Prompt Generator';
    title.className = 'title';
    this.container.appendChild(title);

    // Create description
    const description = document.createElement('p');
    description.textContent = 'Generate high-quality video prompts for Pollinations AI/OpenAI GPT-4.1 API';
    description.className = 'description';
    this.container.appendChild(description);

    // Create form container
    this.formContainer = document.createElement('div');
    this.formContainer.className = 'form-container';

    // Create prompt settings section
    this.createPromptSettings();
    
    // Create advanced options section (collapsible)
    this.createAdvancedOptions();

    // Create output section
    this.createOutputSection();

    // Add form to container
    this.container.appendChild(this.formContainer);

    // Add container to body
    document.body.appendChild(this.container);
  }

  createPromptSettings() {
    const settingsSection = document.createElement('div');
    settingsSection.className = 'section';

    // Subject input
    const subjectGroup = document.createElement('div');
    subjectGroup.className = 'input-group';
    const subjectLabel = document.createElement('label');
    subjectLabel.textContent = 'Main Subject:';
    subjectLabel.htmlFor = 'subject';
    this.subjectInput = document.createElement('input');
    this.subjectInput.type = 'text';
    this.subjectInput.id = 'subject';
    this.subjectInput.placeholder = 'e.g., cyberpunk city, futuristic robot';
    subjectGroup.appendChild(subjectLabel);
    subjectGroup.appendChild(this.subjectInput);
    settingsSection.appendChild(subjectGroup);

    // Action input
    const actionGroup = document.createElement('div');
    actionGroup.className = 'input-group';
    const actionLabel = document.createElement('label');
    actionLabel.textContent = 'Action/Verb:';
    actionLabel.htmlFor = 'action';
    this.actionInput = document.createElement('input');
    this.actionInput.type = 'text';
    this.actionInput.id = 'action';
    this.actionInput.placeholder = 'e.g., flying, dancing, transforming';
    actionGroup.appendChild(actionLabel);
    actionGroup.appendChild(this.actionInput);
    settingsSection.appendChild(actionGroup);

    // Style select
    const styleGroup = document.createElement('div');
    styleGroup.className = 'input-group';
    const styleLabel = document.createElement('label');
    styleLabel.textContent = 'Visual Style:';
    styleLabel.htmlFor = 'style';
    this.styleSelect = document.createElement('select');
    this.styleSelect.id = 'style';
    const styles = [
      'Cinematic', 'Anime', 'Cyberpunk', 'Steampunk', 
      'Realistic', 'Painterly', 'Watercolor', 'Pixel Art',
      'Claymation', 'Surreal', 'Minimalist', 'Retro Futurism'
    ];
    styles.forEach(style => {
      const option = document.createElement('option');
      option.value = style.toLowerCase();
      option.textContent = style;
      this.styleSelect.appendChild(option);
    });
    styleGroup.appendChild(styleLabel);
    styleGroup.appendChild(this.styleSelect);
    settingsSection.appendChild(styleGroup);

    // Mood select
    const moodGroup = document.createElement('div');
    moodGroup.className = 'input-group';
    const moodLabel = document.createElement('label');
    moodLabel.textContent = 'Mood/Tone:';
    moodLabel.htmlFor = 'mood';
    this.moodSelect = document.createElement('select');
    this.moodSelect.id = 'mood';
    const moods = [
      'Epic', 'Mysterious', 'Romantic', 'Dark', 
      'Whimsical', 'Energetic', 'Melancholic', 'Futuristic',
      'Vintage', 'Dreamy', 'Horror', 'Comedic'
    ];
    moods.forEach(mood => {
      const option = document.createElement('option');
      option.value = mood.toLowerCase();
      option.textContent = mood;
      this.moodSelect.appendChild(option);
    });
    moodGroup.appendChild(moodLabel);
    moodGroup.appendChild(this.moodSelect);
    settingsSection.appendChild(moodGroup);

    // Camera angle select
    const cameraGroup = document.createElement('div');
    cameraGroup.className = 'input-group';
    const cameraLabel = document.createElement('label');
    cameraLabel.textContent = 'Camera Angle:';
    cameraLabel.htmlFor = 'camera';
    this.cameraSelect = document.createElement('select');
    this.cameraSelect.id = 'camera';
    const cameras = [
      'Close-up', 'Medium shot', 'Wide shot', 'Aerial view',
      'Dutch angle', 'Over-the-shoulder', 'Point-of-view', 'Tracking shot'
    ];
    cameras.forEach(camera => {
      const option = document.createElement('option');
      option.value = camera.toLowerCase();
      option.textContent = camera;
      this.cameraSelect.appendChild(option);
    });
    cameraGroup.appendChild(cameraLabel);
    cameraGroup.appendChild(this.cameraSelect);
    settingsSection.appendChild(cameraGroup);

    // Lighting select
    const lightingGroup = document.createElement('div');
    lightingGroup.className = 'input-group';
    const lightingLabel = document.createElement('label');
    lightingLabel.textContent = 'Lighting:';
    lightingLabel.htmlFor = 'lighting';
    this.lightingSelect = document.createElement('select');
    this.lightingSelect.id = 'lighting';
    const lightings = [
      'Natural', 'Studio', 'Neon', 'Volumetric',
      'Low-key', 'High-key', 'Backlit', 'Rim light'
    ];
    lightings.forEach(lighting => {
      const option = document.createElement('option');
      option.value = lighting.toLowerCase();
      option.textContent = lighting;
      this.lightingSelect.appendChild(option);
    });
    lightingGroup.appendChild(lightingLabel);
    lightingGroup.appendChild(this.lightingSelect);
    settingsSection.appendChild(lightingGroup);

    this.formContainer.appendChild(settingsSection);
  }

  createAdvancedOptions() {
    const advancedSection = document.createElement('div');
    advancedSection.className = 'section advanced-section';

    // Advanced options toggle
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'toggle-container';
    this.advancedToggle = document.createElement('input');
    this.advancedToggle.type = 'checkbox';
    this.advancedToggle.id = 'advanced-toggle';
    this.advancedToggle.className = 'toggle';
    const toggleLabel = document.createElement('label');
    toggleLabel.htmlFor = 'advanced-toggle';
    toggleLabel.textContent = 'Advanced Options';
    toggleContainer.appendChild(this.advancedToggle);
    toggleContainer.appendChild(toggleLabel);
    advancedSection.appendChild(toggleContainer);

    // Advanced options content (hidden by default)
    this.advancedContent = document.createElement('div');
    this.advancedContent.className = 'advanced-content';

    // Color palette
    const colorGroup = document.createElement('div');
    colorGroup.className = 'input-group';
    const colorLabel = document.createElement('label');
    colorLabel.textContent = 'Color Palette:';
    colorLabel.htmlFor = 'color';
    this.colorInput = document.createElement('input');
    this.colorInput.type = 'text';
    this.colorInput.id = 'color';
    this.colorInput.placeholder = 'e.g., pastel blues and pinks, monochrome';
    colorGroup.appendChild(colorLabel);
    colorGroup.appendChild(this.colorInput);
    this.advancedContent.appendChild(colorGroup);

    // Artist/Influences
    const artistGroup = document.createElement('div');
    artistGroup.className = 'input-group';
    const artistLabel = document.createElement('label');
    artistLabel.textContent = 'Artistic Influences:';
    artistLabel.htmlFor = 'artists';
    this.artistInput = document.createElement('input');
    this.artistInput.type = 'text';
    this.artistInput.id = 'artists';
    this.artistInput.placeholder = 'e.g., Studio Ghibli, Wes Anderson';
    artistGroup.appendChild(artistLabel);
    artistGroup.appendChild(this.artistInput);
    this.advancedContent.appendChild(artistGroup);

    // Resolution
    const resolutionGroup = document.createElement('div');
    resolutionGroup.className = 'input-group';
    const resolutionLabel = document.createElement('label');
    resolutionLabel.textContent = 'Resolution:';
    resolutionLabel.htmlFor = 'resolution';
    this.resolutionSelect = document.createElement('select');
    this.resolutionSelect.id = 'resolution';
    const resolutions = [
      '480p', '720p', '1080p', '2K', '4K', '8K'
    ];
    resolutions.forEach(res => {
      const option = document.createElement('option');
      option.value = res;
      option.textContent = res;
      this.resolutionSelect.appendChild(option);
    });
    resolutionGroup.appendChild(resolutionLabel);
    resolutionGroup.appendChild(this.resolutionSelect);
    this.advancedContent.appendChild(resolutionGroup);

    // Frame rate
    const fpsGroup = document.createElement('div');
    fpsGroup.className = 'input-group';
    const fpsLabel = document.createElement('label');
    fpsLabel.textContent = 'Frame Rate:';
    fpsLabel.htmlFor = 'fps';
    this.fpsSelect = document.createElement('select');
    this.fpsSelect.id = 'fps';
    const fpsOptions = [
      '24 fps (cinematic)', '30 fps (standard)', '60 fps (smooth)'
    ];
    fpsOptions.forEach(fps => {
      const option = document.createElement('option');
      option.value = fps.split(' ')[0];
      option.textContent = fps;
      this.fpsSelect.appendChild(option);
    });
    fpsGroup.appendChild(fpsLabel);
    fpsGroup.appendChild(this.fpsSelect);
    this.advancedContent.appendChild(fpsGroup);

    // Aspect ratio
    const aspectGroup = document.createElement('div');
    aspectGroup.className = 'input-group';
    const aspectLabel = document.createElement('label');
    aspectLabel.textContent = 'Aspect Ratio:';
    aspectLabel.htmlFor = 'aspect';
    this.aspectSelect = document.createElement('select');
    this.aspectSelect.id = 'aspect';
    const aspects = [
      '16:9 (widescreen)', '4:3 (standard)', '1:1 (square)', '21:9 (ultrawide)', '9:16 (vertical)'
    ];
    aspects.forEach(aspect => {
      const option = document.createElement('option');
      option.value = aspect.split(' ')[0];
      option.textContent = aspect;
      this.aspectSelect.appendChild(option);
    });
    aspectGroup.appendChild(aspectLabel);
    aspectGroup.appendChild(this.aspectSelect);
    this.advancedContent.appendChild(aspectGroup);

    // Additional details
    const detailsGroup = document.createElement('div');
    detailsGroup.className = 'input-group';
    const detailsLabel = document.createElement('label');
    detailsLabel.textContent = 'Additional Details:';
    detailsLabel.htmlFor = 'details';
    this.detailsInput = document.createElement('textarea');
    this.detailsInput.id = 'details';
    this.detailsInput.placeholder = 'Any other specific details or requirements...';
    this.detailsInput.rows = 3;
    detailsGroup.appendChild(detailsLabel);
    detailsGroup.appendChild(this.detailsInput);
    this.advancedContent.appendChild(detailsGroup);

    advancedSection.appendChild(this.advancedContent);
    this.formContainer.appendChild(advancedSection);
  }

  createOutputSection() {
    const outputSection = document.createElement('div');
    outputSection.className = 'section output-section';

    // Generate button
    this.generateButton = document.createElement('button');
    this.generateButton.className = 'generate-button';
    this.generateButton.textContent = 'Generate Video Prompt';
    outputSection.appendChild(this.generateButton);

    // Prompt output
    const outputGroup = document.createElement('div');
    outputGroup.className = 'output-group';
    const outputLabel = document.createElement('label');
    outputLabel.textContent = 'Generated Prompt:';
    outputLabel.htmlFor = 'prompt-output';
    this.promptOutput = document.createElement('textarea');
    this.promptOutput.id = 'prompt-output';
    this.promptOutput.readOnly = true;
    this.promptOutput.rows = 5;
    outputGroup.appendChild(outputLabel);
    outputGroup.appendChild(this.promptOutput);

    // Copy button
    this.copyButton = document.createElement('button');
    this.copyButton.className = 'copy-button';
    this.copyButton.textContent = 'Copy Prompt';
    outputGroup.appendChild(this.copyButton);

    outputSection.appendChild(outputGroup);
    this.formContainer.appendChild(outputSection);
  }

  setupEventListeners() {
    // Advanced options toggle
    this.advancedToggle.addEventListener('change', () => {
      this.advancedContent.style.display = this.advancedToggle.checked ? 'block' : 'none';
    });

    // Generate button click
    this.generateButton.addEventListener('click', () => {
      this.generatePrompt();
    });

    // Copy button click
    this.copyButton.addEventListener('click', () => {
      this.copyPrompt();
    });
  }

  loadPresets() {
    // Set default values for demonstration
    this.subjectInput.value = 'cyberpunk cityscape';
    this.actionInput.value = 'glowing with neon lights';
    this.styleSelect.value = 'cyberpunk';
    this.moodSelect.value = 'futuristic';
    this.cameraSelect.value = 'aerial view';
    this.lightingSelect.value = 'neon';
    this.colorInput.value = 'neon blues, purples, and pinks';
    this.artistInput.value = 'Blade Runner, Akira';
    this.resolutionSelect.value = '1080p';
    this.fpsSelect.value = '24';
    this.aspectSelect.value = '16:9';
    this.detailsInput.value = 'Rain falling, reflections on wet surfaces, holographic advertisements';
  }

  generatePrompt() {
    const subject = this.subjectInput.value.trim();
    const action = this.actionInput.value.trim();
    const style = this.styleSelect.value;
    const mood = this.moodSelect.value;
    const camera = this.cameraSelect.value;
    const lighting = this.lightingSelect.value;
    const color = this.colorInput.value.trim();
    const artists = this.artistInput.value.trim();
    const resolution = this.resolutionSelect.value;
    const fps = this.fpsSelect.value;
    const aspect = this.aspectSelect.value;
    const details = this.detailsInput.value.trim();

    if (!subject) {
      alert('Please enter a main subject for your video');
      return;
    }

    let prompt = `Create a ${style} style video of ${subject} ${action}. `;
    prompt += `The mood should be ${mood} with ${lighting} lighting. `;
    prompt += `Use a ${camera} camera angle. `;

    if (color) {
      prompt += `Color palette: ${color}. `;
    }

    if (artists) {
      prompt += `Artistic influences: ${artists}. `;
    }

    if (this.advancedToggle.checked) {
      prompt += `Technical specifications: ${resolution} resolution, ${fps} fps, ${aspect} aspect ratio. `;
    }

    if (details) {
      prompt += `Additional details: ${details}. `;
    }

    prompt += `--v 4.1 --style 4b --q 2`;

    this.promptOutput.value = prompt;
  }

  copyPrompt() {
    if (!this.promptOutput.value) {
      alert('No prompt to copy! Generate a prompt first.');
      return;
    }

    this.promptOutput.select();
    document.execCommand('copy');

    // Visual feedback
    const originalText = this.copyButton.textContent;
    this.copyButton.textContent = 'Copied!';
    setTimeout(() => {
      this.copyButton.textContent = originalText;
    }, 2000);
  }
}

// Initialize the generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new VideoPromptGenerator();
});
