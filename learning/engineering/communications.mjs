import {departments, labs as instruments} from './catalog.mjs?v=curr2';
import {coveredModels, stages} from './curriculum.mjs';

export const courseDepartment = departments.find(d => d.id === 'communications');
export const courseSubjects = stages(courseDepartment.id).flat();
const modelIds = new Set(coveredModels(courseDepartment.id));
export const courseLabs = instruments.filter(l => modelIds.has(l.id));
