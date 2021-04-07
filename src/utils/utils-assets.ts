// Various remote asset utils
export function getUrlCourseCover(id: number, nameImg: string) {
  const domain = process.env.USE_CDN ? process.env.LMS_DOMAIN_CDN : process.env.LMS_DOMAIN;
  const url = `${domain}/backend/images/${id}_${nameImg}`;
  return url;
}

export function getSchoolCoverImage(id: number, nameImg: string) {
  const domain = process.env.USE_CDN ? process.env.LMS_DOMAIN_CDN : process.env.LMS_DOMAIN;
  const url = `${domain}/backend/images/school_${id}_${nameImg}`;
  return url;
}
export function getUrlTeacherCover(id: number, nameImg: string) {
  const domain = process.env.USE_CDN ? process.env.LMS_DOMAIN_CDN : process.env.LMS_DOMAIN;
  const url = `${domain}/backend/images/teacher_${id}_${nameImg}`;
  return url;
}
