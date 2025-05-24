import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

interface QuickNotesSettings {
	targetFolder: string;
	defaultTemplate: string;
	showNotices: boolean;
}

const DEFAULT_SETTINGS: QuickNotesSettings = {
	targetFolder: '',
	defaultTemplate: '',
	showNotices: true
}

export default class QuickNotesPlugin extends Plugin {
	settings: QuickNotesSettings;

	async onload() {
		await this.loadSettings();

		// Ribbon icon
		this.addRibbonIcon('file-plus', 'QuickNotes', (evt: MouseEvent) => {
			new TitlePromptModal(this.app, this.settings, (title: string) => {
				this.createNote(title);
			}).open();
		});

		// Command
		this.addCommand({
			id: 'create-quick-note',
			name: 'QuickNotes',
			callback: () => {
				new TitlePromptModal(this.app, this.settings, (title: string) => {
					this.createNote(title);
				}).open();
			}
		});

		// Settings tab
		this.addSettingTab(new QuickNotesSettingTab(this.app, this));
	}

	showNotice(message: string) {
		if (this.settings.showNotices) {
			new Notice(message);
		}
	}

	parseTemplate(template: string, title: string): string {
		const now = new Date();

		// Format date/time with custom format
		const formatDateTime = (date: Date, format: string): string => {
			const pad = (n: number, len = 2) => n.toString().padStart(len, '0');

			return format
				.replace(/YYYY/g, date.getFullYear().toString())
				.replace(/YY/g, date.getFullYear().toString().slice(-2))
				.replace(/MM/g, pad(date.getMonth() + 1))
				.replace(/M/g, (date.getMonth() + 1).toString())
				.replace(/DD/g, pad(date.getDate()))
				.replace(/D/g, date.getDate().toString())
				.replace(/HH/g, pad(date.getHours()))
				.replace(/H/g, date.getHours().toString())
				.replace(/hh/g, pad(date.getHours() > 12 ? date.getHours() - 12 : date.getHours() || 12))
				.replace(/h/g, (date.getHours() > 12 ? date.getHours() - 12 : date.getHours() || 12).toString())
				.replace(/mm/g, pad(date.getMinutes()))
				.replace(/m/g, date.getMinutes().toString())
				.replace(/ss/g, pad(date.getSeconds()))
				.replace(/s/g, date.getSeconds().toString())
				.replace(/A/g, date.getHours() >= 12 ? 'PM' : 'AM')
				.replace(/a/g, date.getHours() >= 12 ? 'pm' : 'am');
		};

		return template
			// Custom date formats
			.replace(/\{\{date:([^}]+)\}\}/g, (match, format) => formatDateTime(now, format))
			// Custom time formats
			.replace(/\{\{time:([^}]+)\}\}/g, (match, format) => formatDateTime(now, format))
			// Default formats
			.replace(/\{\{title\}\}/g, title)
			.replace(/\{\{date\}\}/g, formatDateTime(now, 'DD-MM-YYYY'))
			.replace(/\{\{time\}\}/g, formatDateTime(now, 'HH:mm'))
			.replace(/\{\{timestamp\}\}/g, formatDateTime(now, 'DD-MM-YYYY HH:mm:ss'));
	}

	async createNote(title: string) {
		try {
			// Make 'Quick Notes' folder if no folder specified
			const folderPath = this.settings.targetFolder.trim() || 'Quick Notes';

			// Ensure the target folder exists
			if (!await this.app.vault.adapter.exists(folderPath)) {
				await this.app.vault.createFolder(folderPath);
			}

			// Use 'Untitled' name if title is empty
			let finalTitle = title.trim() || 'Untitled';

			if (finalTitle === 'Untitled' || title.trim() === '') {
				let counter = 0;
				let testTitle = 'Untitled';

				while (await this.app.vault.adapter.exists(`${folderPath}/${testTitle}.md`)) {
					counter++;
					testTitle = `Untitled ${counter}`;
				}
				finalTitle = testTitle;
			}

			// Create the file path
			const fileName = `${finalTitle}.md`;
			const filePath = `${folderPath}/${fileName}`;

			// Open already exists file
			if (await this.app.vault.adapter.exists(filePath)) {
				const existingFile = this.app.vault.getAbstractFileByPath(filePath);
				if (existingFile instanceof TFile) {
					await this.app.workspace.getLeaf().openFile(existingFile);
					this.showNotice(`Opened existing note "${finalTitle}" in ${folderPath}`);
					return;
				}
			}

			// Parse template with variables
			const content = this.parseTemplate(this.settings.defaultTemplate || '', finalTitle);

			// Create the file
			const file = await this.app.vault.create(filePath, content);

			// Open the new note
			await this.app.workspace.getLeaf().openFile(file);

			this.showNotice(`Created note "${finalTitle}" in ${folderPath}`);
		} catch (error) {
			console.error('Error creating note:', error);
			this.showNotice('Failed to create note. Check console for details.');
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class TitlePromptModal extends Modal {
	title: string = '';
	settings: QuickNotesSettings;
	onSubmit: (title: string) => void;

	constructor(app: App, settings: QuickNotesSettings, onSubmit: (title: string) => void) {
		super(app);
		this.settings = settings;
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		const isMobile = window.innerWidth <= 768;

		// Responsive padding
		contentEl.style.padding = isMobile ? '1rem' : '0.3rem';

		// Note creation dialog
		const headerContainer = contentEl.createDiv();
		headerContainer.style.display = 'flex';
		headerContainer.style.justifyContent = 'space-between';
		headerContainer.style.alignItems = 'center';
		headerContainer.style.marginBottom = isMobile ? '1rem' : '0.8rem';

		const titleEl = headerContainer.createEl('h2', { text: 'Title' });
		titleEl.style.margin = '0';
		titleEl.style.color = 'var(--text-normal)';
		titleEl.style.fontSize = isMobile ? '1.2rem' : '1.3rem';

		const inputContainer = contentEl.createDiv();
		inputContainer.style.marginBottom = isMobile ? '1.1rem' : '0.9rem';

		const input = inputContainer.createEl('input', {
			type: 'text'
		});
		input.style.width = '100%';
		input.style.padding = '0.65rem';
		input.style.fontSize = '1rem';
		input.style.backgroundColor = 'var(--background-primary-alt)';
		input.style.border = '1px solid var(--background-modifier-border)';
		input.style.borderRadius = '0.25rem';
		input.style.color = 'var(--text-normal)';

		// Focus the input
		setTimeout(() => input.focus(), 100);

		const buttonContainer = contentEl.createDiv();
		buttonContainer.style.display = 'flex';
		buttonContainer.style.gap = '0.5rem';
		buttonContainer.style.justifyContent = 'flex-end';

		// Cancel button
		const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
		cancelButton.style.backgroundColor = 'var(--background-modifier-hover)';
		cancelButton.style.color = 'var(--text-normal)';
		cancelButton.style.border = '1px solid var(--background-modifier-border)';
		cancelButton.style.padding = '0.5rem 1rem';
		cancelButton.style.borderRadius = '0.25rem';
		cancelButton.style.cursor = 'pointer';
		cancelButton.style.boxShadow = 'none';
		cancelButton.style.transition = 'background-color 0.2s ease';

		// Create button
		const createButton = buttonContainer.createEl('button', { text: 'Create' });
		createButton.style.backgroundColor = 'var(--interactive-accent)';
		createButton.style.color = 'var(--text-on-accent)';
		createButton.style.border = 'none';
		createButton.style.padding = '0.5rem 1rem';
		createButton.style.borderRadius = '0.25rem';
		createButton.style.cursor = 'pointer';
		createButton.style.boxShadow = 'none';
		createButton.style.transition = 'background-color 0.2s ease';

		// Hover effects
		cancelButton.addEventListener('mouseenter', () => {
			cancelButton.style.backgroundColor = 'var(--background-modifier-hover-active)';
		});
		cancelButton.addEventListener('mouseleave', () => {
			cancelButton.style.backgroundColor = 'var(--background-modifier-hover)';
		});

		createButton.addEventListener('mouseenter', () => {
			createButton.style.backgroundColor = 'var(--interactive-accent-hover)';
			createButton.style.filter = 'brightness(0.95)';
		});
		createButton.addEventListener('mouseleave', () => {
			createButton.style.backgroundColor = 'var(--interactive-accent)';
			createButton.style.filter = 'none';
		});

		const handleSubmit = () => {
			const title = input.value.trim();
			this.onSubmit(title);
			this.close();
		};

		createButton.addEventListener('click', handleSubmit);
		cancelButton.addEventListener('click', () => this.close());

		// Enter key
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				handleSubmit();
			} else if (e.key === 'Escape') {
				this.close();
			}
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class QuickNotesSettingTab extends PluginSettingTab {
	plugin: QuickNotesPlugin;

	constructor(app: App, plugin: QuickNotesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const isMobile = window.innerWidth <= 768;

		new Setting(containerEl)
			.setName('Target Folder')
			.setDesc('The folder where new notes will be created.')
			.addText(text => text
				.setPlaceholder('Quick Notes')
				.setValue(this.plugin.settings.targetFolder)
				.onChange(async (value) => {
					this.plugin.settings.targetFolder = value;
					await this.plugin.saveSettings();
				}));

		const templateSetting = new Setting(containerEl)
			.setName('Default Template')
			.setDesc('')
			.addTextArea(text => text
				.setPlaceholder('Created: {{timestamp}}')
				.setValue(this.plugin.settings.defaultTemplate)
				.onChange(async (value) => {
					this.plugin.settings.defaultTemplate = value;
					await this.plugin.saveSettings();
				}));

		const descEl = templateSetting.descEl;
		descEl.innerHTML = '';
		descEl.createSpan({ text: 'Default content for new notes. ' });

		const linkEl = descEl.createEl('a', {
			text: 'See the variables',
			href: 'https://github.com/ZeroMB/Obsidian-QuickNotes'
		});
		linkEl.style.color = 'var(--interactive-accent)';
		linkEl.style.textDecoration = 'none';
		linkEl.addEventListener('mouseenter', () => {
			linkEl.style.textDecoration = 'underline';
		});
		linkEl.addEventListener('mouseleave', () => {
			linkEl.style.textDecoration = 'none';
		});
		linkEl.addEventListener('click', (e) => {
			e.preventDefault();
			window.open('https://github.com/ZeroMB/Obsidian-QuickNotes', '_blank');
		});

		// Responsive textarea
		if (isMobile) {
			const textAreaEl = templateSetting.controlEl.querySelector('textarea') as HTMLTextAreaElement;
			if (textAreaEl) {
				textAreaEl.style.width = '100%';
				textAreaEl.style.minWidth = '100%';
				textAreaEl.style.maxWidth = '100%';
			}
		}

		new Setting(containerEl)
			.setName('Show Notifications')
			.setDesc('Enable or disable toast notifications when creating or opening notes.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showNotices)
				.onChange(async (value) => {
					this.plugin.settings.showNotices = value;
					await this.plugin.saveSettings();
				}));
	}
}