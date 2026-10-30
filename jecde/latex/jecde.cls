\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{jecde}[2026/10/30 v1.0 JECDE author template]
\newif\ifjecreview
\DeclareOption{review}{\jecreviewtrue}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions\relax
\LoadClass[10pt,a4paper,twocolumn]{article}
\RequirePackage[T1]{fontenc}
\RequirePackage[utf8]{inputenc}
\RequirePackage{mathpazo}
\RequirePackage[scaled=.94]{helvet}
\RequirePackage{microtype}
\RequirePackage[margin=18mm,top=20mm,bottom=20mm,headheight=14pt,headsep=5mm]{geometry}
\RequirePackage{amsmath,amssymb,graphicx,booktabs,array,tabularx}
\RequirePackage{xcolor,tikz,titlesec,fancyhdr,caption,enumitem}
\RequirePackage[most]{tcolorbox}
\RequirePackage{hyperref}
\definecolor{jecgreen}{HTML}{176952}
\definecolor{jecink}{HTML}{122C36}
\definecolor{jecsage}{HTML}{E9EFE7}
\definecolor{jecgray}{HTML}{52656C}
\hypersetup{colorlinks=true,linkcolor=jecgreen,citecolor=jecgreen,urlcolor=jecgreen,pdftitle={JECDE manuscript}}
\raggedbottom
\setlength{\columnsep}{7mm}
\setlength{\parindent}{1em}
\setlength{\parskip}{1pt}
\setlist{nosep,leftmargin=*}
\captionsetup{font=small,labelfont={bf,color=jecgreen},labelsep=period}
\titleformat{\section}{\sffamily\large\bfseries\color{jecink}}{\color{jecgreen}\thesection}{.65em}{}
\titleformat{\subsection}{\sffamily\normalsize\bfseries\color{jecink}}{\thesubsection}{.65em}{}
\titlespacing*{\section}{0pt}{12pt}{5pt}
\titlespacing*{\subsection}{0pt}{9pt}{3pt}
\newcommand{\jecmark}{\begin{tikzpicture}[baseline=-.5ex,x=.10cm,y=.10cm]\fill[jecink,rounded corners=2pt](0,0)rectangle(6,6);\draw[white,line width=1pt](1.5,4.5)--(4.6,4.5)(1.5,3)--(3.5,3)(1.5,1.5)--(4.6,1.5)(1.5,1.5)--(1.5,4.5);\fill[jecgreen](4.6,3)circle(.55);\end{tikzpicture}}
\newcommand{\@jecauthors}{Author names}
\newcommand{\@jecaffiliations}{Affiliations}
\newcommand{\@jecabstract}{}
\newcommand{\@jeckeywords}{}
\newcommand{\@jeccorrespondence}{}
\newcommand{\@jecshort}{JECDE manuscript}
\newcommand{\@jectype}{Research article}
\newcommand{\jecauthors}[1]{\gdef\@jecauthors{#1}}
\newcommand{\jecaffiliations}[1]{\gdef\@jecaffiliations{#1}}
\newcommand{\jecabstract}[1]{\gdef\@jecabstract{#1}}
\newcommand{\jeckeywords}[1]{\gdef\@jeckeywords{#1}}
\newcommand{\jeccorrespondence}[1]{\gdef\@jeccorrespondence{#1}}
\newcommand{\jecshorttitle}[1]{\gdef\@jecshort{#1}}
\newcommand{\jecarticletype}[1]{\gdef\@jectype{#1}}
\pagestyle{fancy}\fancyhf{}
\fancyhead[L]{\sffamily\scriptsize\color{jecgreen}\textbf{JECDE}\quad\color{jecgray}\@jecshort}
\fancyhead[R]{\sffamily\scriptsize Author manuscript}
\fancyfoot[L]{\sffamily\scriptsize\color{jecgray}Journal of Electrical, Computer and Digital Engineering}
\fancyfoot[R]{\sffamily\small\color{jecgreen}\thepage}
\renewcommand{\headrulewidth}{.4pt}
\renewcommand{\footrulewidth}{0pt}
\renewcommand{\maketitle}{\twocolumn[{\begin{minipage}{\textwidth}
\noindent\jecmark\hspace{9pt}\begin{minipage}{.87\textwidth}{\sffamily\Large\bfseries\color{jecink}JECDE}\\[-1pt]{\sffamily\small Journal of Electrical, Computer and Digital Engineering}\end{minipage}\par
\vspace{7pt}\noindent{\color{jecgreen}\rule{\textwidth}{1.5pt}}\par
\vspace{10pt}{\sffamily\footnotesize\bfseries\color{jecgreen}\MakeUppercase{\@jectype}\hfill AUTHOR MANUSCRIPT}\par
\vspace{8pt}{\sffamily\huge\bfseries\color{jecink}\@title\par}\vspace{10pt}
\ifjecreview{\sffamily\normalsize Anonymous review manuscript\par}\else{\sffamily\normalsize\@jecauthors\par}\vspace{4pt}{\small\color{jecgray}\@jecaffiliations\par}\vspace{4pt}{\footnotesize\@jeccorrespondence\par}\fi
\vspace{12pt}\begin{tcolorbox}[enhanced,colback=jecsage,colframe=jecsage,boxrule=0pt,sharp corners,borderline west={2pt}{0pt}{jecgreen},left=10pt,right=10pt,top=9pt,bottom=9pt]
{\sffamily\small\bfseries\color{jecgreen}ABSTRACT}\par\vspace{3pt}{\small\@jecabstract\par}\vspace{6pt}{\sffamily\footnotesize\textbf{Keywords:} \@jeckeywords}
\end{tcolorbox}\vspace{10pt}
\end{minipage}}]\thispagestyle{plain}\pagestyle{fancy}}
\fancypagestyle{plain}{\fancyhf{}\fancyfoot[L]{\sffamily\scriptsize\color{jecgray}JECDE\quad Author manuscript template}\fancyfoot[R]{\sffamily\small\color{jecgreen}\thepage}\renewcommand{\headrulewidth}{0pt}}
\newcounter{jecalgorithm}
\newenvironment{jecalgorithm}[1]{\refstepcounter{jecalgorithm}\begin{tcolorbox}[enhanced,breakable,colback=white,colframe=jecgreen,boxrule=.5pt,sharp corners,title={Algorithm \thejecalgorithm.\ #1},colbacktitle=jecgreen,coltitle=white,fonttitle=\sffamily\small\bfseries,left=7pt,right=7pt,top=7pt,bottom=7pt]\small}{\end{tcolorbox}}
\newenvironment{jecnote}[1]{\begin{tcolorbox}[colback=jecsage,colframe=jecsage,boxrule=0pt,sharp corners,title={#1},coltitle=jecink,colbacktitle=jecsage,fonttitle=\sffamily\bfseries\small]\small}{\end{tcolorbox}}
\endinput
