# Favicons

## Functionality

Consistent branding cross platform.

## Usage

### Generate

To generate the favicons use:

    npm run build:favicons

The generated HTML partial with meta tags for all files is in `favicons.html`.

As `favicons.html`, the image and manifest files is auto-generated,
don't try to edit them manually. Instead use `/lib/favicons.js` to configure the favicons.

### Include

Include the generated HTML partial:

    {% include "components/favicons/favicons.html" %}