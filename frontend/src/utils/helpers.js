export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatSalary = (salary) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(salary);
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const calculateProfileCompletion = (user) => {
  const fields = [
    'fullName',
    'email',
    'phone',
    'skills',
    'education',
    'experience',
    'resume',
    'profilePhoto',
  ];

  const completed = fields.filter((field) => user[field]).length;
  return Math.round((completed / fields.length) * 100);
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const generateMatchScore = (jobSkills, userSkills) => {
  const matched = jobSkills.filter((skill) =>
    userSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
  );
  return Math.round((matched.length / jobSkills.length) * 100);
};
