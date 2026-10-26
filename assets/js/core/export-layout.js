/* Shared export header layout. Loaded after script.js so export actions can use these globals. */
window.addExportLogo = function (doc) {
    const pageWidth = doc.internal.pageSize.getWidth(), margin = 40;
    const width = Math.min(220, (pageWidth - margin * 2 - 32) / 2);
    const height = width * 108 / 391;
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 90, 'F');
    if (window.ICExportLogoLeft && window.ICExportLogoRight) {
        doc.addImage(window.ICExportLogoLeft, 'PNG', margin, 18, width, height);
        doc.addImage(window.ICExportLogoRight, 'PNG', pageWidth - margin - width, 18, width, height);
    }
};

window.drawExportHeader = function (doc, title, details, margin) {
    const pageWidth = doc.internal.pageSize.getWidth();
    window.addExportLogo(doc);
    let y = 108;
    const write = (value, size, bold, color) => {
        if (!value) return;
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(size);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(String(value), pageWidth - margin * 2);
        doc.text(lines, margin, y);
        y += lines.length * size * 1.15 + 8;
    };
    write(title, 18, true, [15, 23, 42]);
    details.forEach(value => write(value, 9, false, [71, 85, 105]));
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    return y + 22;
};
