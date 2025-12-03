package com.pasteleria.djulia.service;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.pasteleria.djulia.config.EmpresaConfig;
import com.pasteleria.djulia.model.DetallePedido;
import com.pasteleria.djulia.model.Pedido;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class BoletaService {

    private final EmpresaConfig empresaConfig;

    private PdfFont font;
    private PdfFont fontBold;

    private static final DeviceRgb COLOR_DORADO = new DeviceRgb(184, 134, 11);
    private static final DeviceRgb COLOR_DORADO_CLARO = new DeviceRgb(218, 165, 32);
    private static final DeviceRgb COLOR_GRIS_OSCURO = new DeviceRgb(64, 64, 64);
    private static final DeviceRgb COLOR_FONDO_CREMA = new DeviceRgb(255, 250, 240);

    public byte[] generarBoleta(Pedido pedido) {
        try {
            font = PdfFontFactory.createFont(StandardFonts.HELVETICA, "ISO-8859-1");
            fontBold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD, "ISO-8859-1");

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);
            document.setFont(font);
            document.setMargins(30, 30, 30, 30);

            agregarEncabezado(document, pedido);
            agregarLinea(document);
            agregarDatosCliente(document, pedido);
            agregarEspacio(document, 15);
            agregarTablaProductos(document, pedido);
            agregarEspacio(document, 15);
            agregarTotales(document, pedido);
            agregarEspacio(document, 20);
            agregarPiePagina(document);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar la boleta: " + e.getMessage(), e);
        }
    }

    private void agregarEncabezado(Document document, Pedido pedido) {
        Table headerTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}));
        headerTable.setWidth(UnitValue.createPercentValue(100));

        try {
            ClassPathResource logoResource = new ClassPathResource(empresaConfig.getLogoPath());
            Image logo = new Image(ImageDataFactory.create(logoResource.getURL()));
            logo.setWidth(100);
            logo.setHeight(100);

            Cell logoCell = new Cell()
                    .add(logo)
                    .setBorder(Border.NO_BORDER)
                    .setTextAlignment(TextAlignment.LEFT);
            headerTable.addCell(logoCell);
        } catch (Exception e) {
            headerTable.addCell(new Cell().setBorder(Border.NO_BORDER));
        }

        Cell empresaCell = new Cell()
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.RIGHT);

        empresaCell.add(new Paragraph(empresaConfig.getNombre())
                .setFont(fontBold)
                .setFontSize(18)
                .setFontColor(COLOR_DORADO));
        empresaCell.add(new Paragraph("RUC: " + empresaConfig.getRuc())
                .setFont(font)
                .setFontSize(10)
                .setFontColor(COLOR_GRIS_OSCURO));
        empresaCell.add(new Paragraph(empresaConfig.getDireccion())
                .setFont(font)
                .setFontSize(9)
                .setFontColor(COLOR_GRIS_OSCURO));
        empresaCell.add(new Paragraph("Tel: " + empresaConfig.getTelefono())
                .setFont(font)
                .setFontSize(9)
                .setFontColor(COLOR_GRIS_OSCURO));
        empresaCell.add(new Paragraph(empresaConfig.getEmail())
                .setFont(font)
                .setFontSize(9)
                .setFontColor(COLOR_GRIS_OSCURO));

        headerTable.addCell(empresaCell);
        document.add(headerTable);

        Paragraph titulo = new Paragraph("BOLETA DE VENTA")
                .setFont(fontBold)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(COLOR_DORADO)
                .setMarginTop(10);
        document.add(titulo);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        Paragraph nroBoleta = new Paragraph("N° " + String.format("%08d", pedido.getId()))
                .setFont(fontBold)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(nroBoleta);

        Paragraph fecha = new Paragraph("Fecha: " + pedido.getFechaPedido().format(formatter))
                .setFont(font)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(COLOR_GRIS_OSCURO);
        document.add(fecha);
    }

    private void agregarLinea(Document document) {
        SolidLine line = new SolidLine(1f);
        line.setColor(COLOR_DORADO);
        LineSeparator separator = new LineSeparator(line);
        document.add(separator);
    }

    private void agregarDatosCliente(Document document, Pedido pedido) {
        Paragraph clienteTitulo = new Paragraph("DATOS DEL CLIENTE")
                .setFont(fontBold)
                .setFontSize(11)
                .setFontColor(COLOR_DORADO)
                .setMarginTop(10);
        document.add(clienteTitulo);

        Table clienteTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}));
        clienteTable.setWidth(UnitValue.createPercentValue(100));

        clienteTable.addCell(crearCeldaDato("Cliente:"));
        clienteTable.addCell(crearCeldaValor(pedido.getUsuario().getNombre() + " " + pedido.getUsuario().getApellido()));
        clienteTable.addCell(crearCeldaDato("DNI:"));
        clienteTable.addCell(crearCeldaValor(pedido.getUsuario().getDni()));

        if (pedido.getTipoEntrega().name().equals("DELIVERY")) {
            clienteTable.addCell(crearCeldaDato("Dirección:"));
            clienteTable.addCell(crearCeldaValor(pedido.getDireccionEntrega()));
            clienteTable.addCell(crearCeldaDato("Teléfono:"));
            clienteTable.addCell(crearCeldaValor(pedido.getTelefonoContacto()));
        }

        clienteTable.addCell(crearCeldaDato("Tipo Entrega:"));
        clienteTable.addCell(crearCeldaValor(pedido.getTipoEntrega().getDescripcion()));

        document.add(clienteTable);
    }

    private void agregarTablaProductos(Document document, Pedido pedido) {
        Paragraph productosTitulo = new Paragraph("DETALLE DE PRODUCTOS")
                .setFont(fontBold)
                .setFontSize(11)
                .setFontColor(COLOR_DORADO)
                .setMarginTop(10);
        document.add(productosTitulo);

        Table table = new Table(UnitValue.createPercentArray(new float[]{0.5f, 3, 1, 1, 1.5f}));
        table.setWidth(UnitValue.createPercentValue(100));

        table.addHeaderCell(crearCeldaEncabezado("#"));
        table.addHeaderCell(crearCeldaEncabezado("Producto"));
        table.addHeaderCell(crearCeldaEncabezado("Cant."));
        table.addHeaderCell(crearCeldaEncabezado("P. Unit."));
        table.addHeaderCell(crearCeldaEncabezado("Subtotal"));

        int contador = 1;
        for (DetallePedido detalle : pedido.getDetalles()) {
            table.addCell(crearCeldaProducto(String.valueOf(contador++)));
            table.addCell(crearCeldaProducto(detalle.getProducto().getNombre()));
            table.addCell(crearCeldaProducto(String.valueOf(detalle.getCantidad())));
            table.addCell(crearCeldaProducto(String.format("S/. %.2f", detalle.getPrecioUnitario())));
            table.addCell(crearCeldaProducto(String.format("S/. %.2f", detalle.getSubtotal())));
        }

        document.add(table);
    }

    private void agregarTotales(Document document, Pedido pedido) {
        Table totalesTable = new Table(1);
        totalesTable.setWidth(UnitValue.createPercentValue(100));

        Paragraph totalParagraph = new Paragraph()
                .add(new Text("TOTAL A PAGAR: ")
                        .setFont(fontBold)
                        .setFontSize(14)
                        .setFontColor(COLOR_DORADO))
                .add(new Text(String.format("S/. %.2f", pedido.getTotal()))
                        .setFont(fontBold)
                        .setFontSize(16)
                        .setFontColor(COLOR_DORADO));

        Cell totalCell = new Cell()
                .add(totalParagraph)
                .setTextAlignment(TextAlignment.RIGHT)
                .setBackgroundColor(COLOR_FONDO_CREMA)
                .setBorder(new SolidBorder(COLOR_DORADO, 2))
                .setPadding(10);

        totalesTable.addCell(totalCell);
        document.add(totalesTable);
    }

    private void agregarPiePagina(Document document) {
        agregarLinea(document);

        Paragraph agradecimiento = new Paragraph("¡Gracias por su compra!")
                .setFont(fontBold)
                .setFontSize(11)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(COLOR_DORADO)
                .setMarginTop(10);
        document.add(agradecimiento);

        Paragraph mensaje = new Paragraph(
                "Conserve este documento como comprobante de su compra.\n" +
                        "Para cualquier consulta o reclamo, comuníquese con nosotros."
        )
                .setFont(font)
                .setFontSize(9)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(COLOR_GRIS_OSCURO)
                .setMarginTop(5);
        document.add(mensaje);
    }

    private void agregarEspacio(Document document, int altura) {
        document.add(new Paragraph("\n").setMarginTop(altura));
    }

    private Cell crearCeldaDato(String texto) {
        return new Cell()
                .add(new Paragraph(texto)
                        .setFont(fontBold)
                        .setFontSize(9)
                        .setFontColor(COLOR_GRIS_OSCURO))
                .setBorder(Border.NO_BORDER)
                .setPaddingBottom(3);
    }

    private Cell crearCeldaValor(String texto) {
        return new Cell()
                .add(new Paragraph(texto != null ? texto : "")
                        .setFont(font)
                        .setFontSize(9))
                .setBorder(Border.NO_BORDER)
                .setPaddingBottom(3);
    }

    private Cell crearCeldaEncabezado(String texto) {
        return new Cell()
                .add(new Paragraph(texto)
                        .setFont(fontBold)
                        .setFontSize(10)
                        .setFontColor(DeviceRgb.WHITE))
                .setBackgroundColor(COLOR_DORADO)
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(5);
    }

    private Cell crearCeldaProducto(String texto) {
        return new Cell()
                .add(new Paragraph(texto)
                        .setFont(font)
                        .setFontSize(9))
                .setBorder(new SolidBorder(COLOR_DORADO_CLARO, 0.5f))
                .setPadding(5);
    }
}