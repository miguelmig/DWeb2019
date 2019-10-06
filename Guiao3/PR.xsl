<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="2.0">
    <xsl:output method="xhtml" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html>
           <head>
               <title>Project Record</title>
               <meta charset="UTF8" />
               <!--<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />-->
           </head>
           <body>
                <h1 align = "center">Project Record</h1>
                <hr/>
                
                <xsl:apply-templates/>
           </body>
        </html>
    </xsl:template>
    
    <xsl:template match="metadata">
        <table width = "100%" border="0">
            <tbody>
                <tr>
                    <td width="50%"><B>KEY NAME:</B> 
                        <font color="#000080">
                            <xsl:value-of select="keyname"/>
                        </font>
                    </td>
                    
                    <td width="50%"><B>Begin Date:</B> 
                        <font color="#000080">
                            <xsl:value-of select="bdate"/>
                        </font>
                    </td>
                </tr>
                
                <tr>
                    <td width="50%"><B>Title:</B> 
                        <font color="#000080">
                            <xsl:value-of select="title"/>
                        </font>
                    </td>
                    
                    <td width="50%"><B>End Date:</B> 
                        <font color="#000080">
                            <xsl:value-of select="edate"/>
                        </font>
                    </td>
                </tr>
                
                <tr>
                    <td width="50%">
                        <xsl:apply-templates select="subtitle"/>
                    </td>
                    
                    <td width="50%"><B>Supervisor:</B> 
                        <font color="#000080">
                            <a href="{supervisor/@homepage}"><xsl:value-of select="supervisor"/></a>
                        </font>
                    </td>
                </tr>
                
            </tbody>
        </table>
        <hr/>
        
    </xsl:template>
    
    <xsl:template match="metadata/subtitle">
        <b>Subtitle:</b> 
        <font color="#000080">
            <xsl:value-of select="."/>
        </font>
    </xsl:template> 
    
    <xsl:template match="workteam">
        <h3>Work-Team:</h3>    
        
        <ol>
            <xsl:apply-templates/>
        </ol>
        <hr/>
    </xsl:template>
    
    <xsl:template match="worker">
        <li>
            <xsl:apply-templates/>
        </li>
    </xsl:template>
    
    <xsl:template match="worker/email">
        <a href="mailto:{.}"><xsl:value-of select="."/></a>
    </xsl:template>
    
    <xsl:template match="worker/git">
        <a href="{.}"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="32px" height="32px"></img></a>
    </xsl:template>
    
    <xsl:template match="abstract">
        <h3>Abstract:</h3>
        <xsl:apply-templates/>
        <hr/>
    </xsl:template>
    
    <xsl:template match="abstract/p">
        <p>
            <xsl:apply-templates/>
        </p>    
    </xsl:template>
    
    <xsl:template match="abstract/b">
        <b>
            <xsl:apply-templates/>
        </b>    
    </xsl:template>
    
    <xsl:template match="abstract/i">
        <i>
            <xsl:apply-templates/>
        </i>    
    </xsl:template>
    
    <xsl:template match="abstract/xref">
        <a href = "{@src}">
            <xsl:apply-templates/>
        </a>    
    </xsl:template>
    
    <xsl:template match="deliverables">
        <h3>Deliverables:</h3>
        <ul>
            <xsl:apply-templates/>
        </ul>    
        <hr/>
    </xsl:template>
    
    <xsl:template match="deliverable">
        <li>
            <a href="{@path}"><xsl:value-of select="."/></a>
        </li> 
    </xsl:template> 
    
</xsl:stylesheet>