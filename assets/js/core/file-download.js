window.ICDownload = window.ICDownload || {};
window.ICDownload.saveFile = function (filename, blob) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
};
window.saveFile = window.ICDownload.saveFile;
