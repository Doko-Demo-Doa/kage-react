export function getCdnLink(strUrl: string) {
  if (process.env.USE_CDN === 'true') {
    return `${process.env.CDN_URL}${strUrl}`;
  }

  return strUrl;
}

export function cdnLinkUrlMaterialMpack(url: string) {
  if (process.env.USE_CDN === 'true' && url !== null) {
    return `${process.env.LMS_DOMAIN_CDN}${url}`;
  }
  return `${process.env.LMS_DOMAIN}${url}`;
}
