## Packages
react-dropzone | For beautiful drag-and-drop file uploads
recharts | For the storage usage dashboard donut chart
framer-motion | For smooth page transitions and micro-interactions
date-fns | For formatting dates

## Notes
- Upload endpoint expects `POST /api/files/upload` with `multipart/form-data`
- The `folderId` will be appended to the FormData if uploading into a specific folder
- Tailwind config should theoretically extend font-family, but we will apply the fonts directly in index.css to ensure they work without tailwind.config.ts changes.
