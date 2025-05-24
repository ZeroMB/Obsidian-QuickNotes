# QuickNotes

A simple and efficient [Obsidian](https://obsidian.md) plugin that allows you to quickly create notes in a specified folder with customizable templates.

## Features

- 🚀 **Quick Note Creation**: Create notes instantly with a simple modal dialog
- 📁 **Flexible Folder Management**: Specify a target folder or use the default "Quick Notes" folder
- 📝 **Template Support**: Use customizable templates with dynamic variables
- 🎯 **Multiple Access Methods**: Ribbon icon and command palette support
- 📱 **Mobile Friendly**: Responsive design that works on both desktop and mobile
- 🔔 **Smart Notifications**: Optional toast notifications for note creation
- 🔄 **Duplicate Handling**: Automatically opens existing notes or creates numbered variations

## Installation

### From Obsidian Community Plugins (Recommended)
1. Open Obsidian Settings
2. Go to Community Plugins
3. Browse and search for "QuickNotes"
4. Install and enable the plugin

### Manual Installation
1. Download the latest release from [GitHub Releases](https://github.com/ZeroMB/Obsidian-QuickNotes/releases)
2. Extract the files to your vault's `.obsidian/plugins/quicknotes/` directory
3. Enable the plugin in Obsidian Settings > Community Plugins

## Usage

### Creating a Note
There are two ways to create a quick note:

1. **Ribbon Icon**: Click the file-plus icon in the left ribbon
2. **Command Palette**: Use `Ctrl/Cmd + P` and search for "QuickNotes"

A modal dialog will appear where you can:
- Enter a title for your note (or leave empty for "Untitled")
- The note will be created in your specified target folder

### Existing Note Behavior
- If a note with the same title already exists, it will be opened instead of creating a duplicate
- For untitled notes, the plugin automatically adds numbers (Untitled, Untitled 1, Untitled 2, etc.)

## Settings

Access plugin settings through: `Settings > Community Plugins > QuickNotes`

### Target Folder
- **Default**: Empty (uses "Quick Notes" folder)
- **Description**: Specify where new notes should be created
- **Behavior**: Leave empty to use "Quick Notes" as the default folder

### Default Template
- **Default**: Empty
- **Description**: Template content for new notes
- **Supports**: Dynamic variables (see Template Variables section)

### Show Notifications
- **Default**: Enabled
- **Description**: Toggle toast notifications when creating or opening notes

## Template Variables

Customize your note templates with these dynamic variables:

### Basic Variables
- `{{title}}` - The note title
- `{{date}}` - Current date (DD-MM-YYYY)
- `{{time}}` - Current time (HH:mm)
- `{{timestamp}}` - Full timestamp (DD-MM-YYYY HH:mm:ss)

### Custom Format Variables
- `{{date:YYYY-MM-DD}}` - Custom date format
- `{{time:hh:mm:ss A}}` - Custom time format

### Format Options
**Date Formats:**
- `YYYY` - 4-digit year (2024)
- `YY` - 2-digit year (24)
- `MM` - 2-digit month (01-12)
- `M` - 1-digit month (1-12)
- `DD` - 2-digit day (01-31)
- `D` - 1-digit day (1-31)

**Time Formats:**
- `HH` - 24-hour format (00-23)
- `H` - 24-hour format (0-23)
- `hh` - 12-hour format (01-12)
- `h` - 12-hour format (1-12)
- `mm` - Minutes (00-59)
- `m` - Minutes (0-59)
- `ss` - Seconds (00-59)
- `s` - Seconds (0-59)
- `A` - AM/PM (uppercase)
- `a` - am/pm (lowercase)

### Template Examples

**Daily Note Template:**
```
# {{title}}

**Created:** {{timestamp}}
**Date:** {{date:YYYY-MM-DD}}

## Notes

## Tasks
- [ ] 

## Reflection
```

**Meeting Template:**
```
# {{title}}

**Date:** {{date:DD/MM/YYYY}}
**Time:** {{time:hh:mm A}}

## Attendees

## Agenda

## Notes

## Action Items

## Next Steps
```

## Requirements

- Obsidian v0.15.0 or higher
- Works on both desktop and mobile devices

## Support

If you encounter any issues or have feature requests:

1. Check existing [Issues](https://github.com/ZeroMB/Obsidian-QuickNotes/issues)
2. Create a new issue with detailed information
3. Include your Obsidian version and plugin version

## Contributing

Contributions are welcome! Please feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## License

[MIT License](LICENSE)

---

**Enjoy quick note creation! 📝**