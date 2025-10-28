// Add/Update in your landing-page.component.scss

// Create consistent padding for all sections
$container-padding-desktop: 96px;
$container-padding-laptop: 80px;
$container-padding-tablet: 60px;
$container-padding-mobile: 24px;

// Top Mini Header (Nav Bar with DOMAINS, GLOSSARY, etc.)
.top-mini-header {
    background-color: #0D3EA1;
    color: #fff;
    font-weight: 500;
    width: 100% !important;
    padding: 0 !important;
    
    .content-wrapper-section {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        // Use same padding as header and content
        padding: 9px $container-padding-desktop 3px $container-padding-desktop !important;
    }
    
    .row {
        margin-left: 0;
        margin-right: 0;
    }
    
    .header-main-menu {
        padding-left: 0;
        margin: 0;
        
        li {
            font-family: Open Sans;
            font-weight: 600;
            font-size: 14px;
            float: left;
            padding: 3px 9px;
            line-height: 25px;
            text-align: center;
            text-transform: uppercase;
            cursor: pointer;
            margin-right: 25px;
            position: relative;
        }

        li:hover {
            background-color: #000;
        }
    }
    
    .right-menu {
        span {
            float: right;
            font-family: Open Sans;
            font-weight: 600;
            font-size: 14px;
            padding: 3px 9px;
            line-height: 25px;
            text-align: center;
            text-transform: uppercase;
            cursor: pointer;
        }

        .right-txt:hover {
            background-color: #000;
        }
    }
}

// Main Content Banner (AI Powered Reports & Insights)
.HeaderNewBgView {
    min-height: 290px;
    background: url('assets/images//onewb/home_banner.png');
    width: 100% !important;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 0 !important;
    
    .content-wrapper-section {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        // Use same padding as header and nav
        padding: 9px $container-padding-desktop 3px $container-padding-desktop !important;
    }
    
    .row {
        margin-left: 0;
        margin-right: 0;
    }
}

// All other content sections
.content-wrapper-section {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 auto !important;
    padding-left: $container-padding-desktop !important;
    padding-right: $container-padding-desktop !important;
    box-sizing: border-box;
}

// Responsive breakpoints - keep padding consistent across all sections
@media only screen and (max-width: 1440px) {
    .top-mini-header .content-wrapper-section,
    .HeaderNewBgView .content-wrapper-section,
    .content-wrapper-section {
        padding-left: $container-padding-laptop !important;
        padding-right: $container-padding-laptop !important;
    }
}

@media only screen and (max-width: 1024px) {
    .top-mini-header .content-wrapper-section,
    .HeaderNewBgView .content-wrapper-section,
    .content-wrapper-section {
        padding-left: $container-padding-tablet !important;
        padding-right: $container-padding-tablet !important;
    }
}

@media only screen and (max-width: 768px) {
    .top-mini-header .content-wrapper-section,
    .HeaderNewBgView .content-wrapper-section,
    .content-wrapper-section {
        padding-left: $container-padding-mobile !important;
        padding-right: $container-padding-mobile !important;
    }
}