## 0.0.330 - 2025-09-29

- Changed the default model back to Sonnet 4 since Sonnet 4.5 hasn't rolled out to all users yet. Sonnet 4.5 is still available from the `/model` slash command

## 0.0.329 - 2025-09-29

- Added support for [Claude Sonnet 4.5](https://github.blog/changelog/2025-09-29-anthropic-claude-sonnet-4-5-is-in-public-preview-for-github-copilot/) and made it the default model
- Added `/model` slash command to easily change the model (fixes https://github.com/github/copilot-cli/issues/10)
    - `/model` will open a picker to change the model
    - `/model <model>` will set the model to the parameter provided
- Added display of currently selected model above the input text box (Addresses feedback in https://github.com/github/copilot-cli/issues/120, https://github.com/github/copilot-cli/issues/108, )
- Improved error messages when users provide incorrect command-line arguments. (Addresses feedback of the discoverability of non-interactive mode from  https://github.com/github/copilot-cli/issues/96)
- Changed the behavior of `Ctrl+r` to expand only recent timeline items. After running `Ctrl+r`, you can use `Ctrl+e` to expand all
- Improved word motion logic to better detect newlines: using word motion keys will now correctly move to the first word on a line
- Improved the handling of multi-line inputs in the input box: the input text box is scrollable, limited to 10 lines. Long prompts won't take up the whole screen anymore! (This is on the way to implementing https://github.com/github/copilot-cli/issues/14)
- Removed the left and right boarders from the input box. This makes it easier to copy text out of it!
- Added glob matching to shell rules. When using `--allow-tool` and `--deny-tool`, you can now specify things like `shell(npm run test:*)` to match any shell commands beginning with `npm run test`
- Improved the `copilot --resume` interface with relative time display, session message count, (Fixes https://github.com/github/copilot-cli/issues/97) 

## 0.0.328 - 2025-09-26

- Improved error message received when Copilot CLI is blocked by organization policy (fixes https://github.com/github/copilot-cli/issues/18 )
- Improved the error message received when using a PAT that is missing the "Copilot Requests" permission (fixes https://github.com/github/copilot-cli/issues/46 )
- Improved the output of `/user list` to make it clearer which is the current user
- Improved PowerShell parsing of `ForEach-Object` and detection of command name expressions (e.g.,`& $someCommand`)
