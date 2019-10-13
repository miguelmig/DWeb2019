<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    
    version="1.0">
    
    <xsl:output method="html" indent="yes" encoding="UTF-8"/>
    
    <xsl:template match="ARQELEM">
        <html>
            <head>
                <title>Arqueossítios: página de arquissitio</title>
                <meta charset="UTF8" />
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
            </head>
            
            <body>
                <table class="w3-table-all">
                    <xsl:apply-templates/>
                </table>
                
                <hr />
            </body>
        </html>
        
    </xsl:template>
    
    <xsl:template match="LIGA">
        <a href="{@TERMO}.html" >
            <xsl:apply-templates />
        </a>
    </xsl:template>
    
    <xsl:template match="IDENTI">
        <tr>
            <th>Identificador</th> <td><b><xsl:apply-templates/></b></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="IMAGEM">
        <tr>
            <th>Imagem</th> <td><img src="{@NOME}" alt="{@NOME}"/></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="DESCRI">
        <tr>
            <th>Descrição</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="CRONO">
        <tr>
            <th>Período Cronológico</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="LUGAR">
        <tr>
            <th>Lugar</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="FREGUE">
        <tr>
            <th>Freguesia</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="CONCEL">
        <tr>
            <th>Concelho</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="CODADM">
        <tr>
            <th>Código Administração</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    
    <xsl:template match="LATITU">
        <tr>
            <th>Latitude</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="LONGIT">
        <tr>
            <th>Longitude</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="ALTITU">
        <tr>
            <th>Altitude</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="ACESSO">
        <tr>
            <th>Método de Acesso</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="QUADRO">
        <tr>
            <th>Enquadramento</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="TRAARQ">
        <tr>
            <th>Trabalhos Arqueológicos</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="DESARQ">
        <tr>
            <th>Descobertas Arqueológicas</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="INTERP">
        <tr>
            <th>Povoação</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="INTERE">
        <tr>
            <th>Interesse</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="DEPOSI">
        <tr>
            <th>Depósitos</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="BIBLIO">
        <tr>
            <th>Bibliografia</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>   
    
    <xsl:template match="AUTOR">
        <tr>
            <th>Autor</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>  
    
    <xsl:template match="DATA">
        <tr>
            <th>Data</th> <td><xsl:apply-templates></xsl:apply-templates></td>
        </tr>
    </xsl:template>  
</xsl:stylesheet>