# Assistant Configuration

This directory contains the assistant specification and related files.

## Structure

- `marel-fish-sales.json` - The assistant specification (source of truth)
- `files/` - Optional directory for vendored KB files (if you don't want OpenAI-hosted vector stores)

## Usage

### Provisioning the Assistant

To create or update the assistant from the JSON spec:

1. Make sure you have your `OPENAI_API_KEY` set in your environment:
   ```bash
   export OPENAI_API_KEY=sk-...
   ```

2. Run the provision script:
   ```bash
   npm run provision
   # or
   pnpm provision
   ```

3. The script will output the `assistant_id`. Copy this into your `.env.local` file:
   ```
   OPENAI_API_KEY=sk-...
   OPENAI_ASSISTANT_ID=asst_...
   ```

### Updating the Assistant

1. Edit `marel-fish-sales.json` with your changes
2. Run `npm run provision` again
3. The script will find the existing assistant by name and update it

### Vector Store

The assistant spec includes a reference to an existing vector store (`vs_qchFZgLai5UirQdjNAJFgH3k`). If you want to use local files instead:

1. Place your KB files in `assistants/files/`
2. Remove the `vector_store_ids` from `tool_resources.file_search` in the JSON
3. Run the provision script - it will automatically create a new vector store and upload the files

### Previously Used Files

The following files were previously used by the agent and are stored in the vector store:

- `WhiteFishLayoutDescription.docx` (9/10/2024, 12:22 PM)
- `SalmonLayoutDescriptions.docx` (9/6/2024, 1:36 PM)

These files are referenced in the vector store (`vs_qchFZgLai5UirQdjNAJFgH3k`) and are available for the assistant to use via file_search.

## Notes

- The assistant name is used to find existing assistants for updates
- If you change the name, a new assistant will be created
- The provision script will preserve the vector store reference if specified in the JSON

