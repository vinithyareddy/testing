const isLocal = window.location.hostname.includes('localhost');
const baseUrl = isLocal ? '/qa-api' : 'https://reports.worldbank.org';

return this.Http.get(baseUrl + '/BIPortalSecurity/rest/bisecurity/getUserProfile?input={"userUpi":"' + upi + '"}');
