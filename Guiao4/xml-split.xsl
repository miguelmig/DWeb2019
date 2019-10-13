<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="2.0">
    
    <xsl:output method="xml" indent="yes" encoding="UTF-8"/>
    
    <xsl:template match="/">
        <xsl:result-document href="index.html" >
            <html>
                <head> 
                    <title>Arquissítios</title>
                    <meta charset="UTF8" />
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
                </head>
                
                <body>
                    <h1>Arquissítios</h1>
                    <h3>Índice:</h3>
                    <ul>
                        <xsl:apply-templates mode="indice"></xsl:apply-templates>
                    </ul>
                    
                </body>
            </html>
        </xsl:result-document>
        <xsl:apply-templates />
    </xsl:template>
    
    <xsl:template match="ARQELEM" mode = "indice">
        <li>
            <a name="{count(preceding-sibling::*)+1}" />
            <a href="{count(preceding-sibling::*)+1}"><xsl:value-of select="count(preceding-sibling::*)+1"/></a>
        </li>
    </xsl:template>        
    
    <xsl:template match="ARQELEM">
        <xsl:result-document href="dataset/arq{count(preceding-sibling::*)+1}.xml">
            <xsl:processing-instruction name="xml-stylesheet" >type="text/xsl" href="arq2html.xsl"</xsl:processing-instruction>
            <xsl:copy-of select="."/>
        </xsl:result-document>
    </xsl:template>
    
    
</xsl:stylesheet>