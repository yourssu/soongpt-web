import { z } from 'zod/v4';

import { PaginatedSchema, ResponseSchema } from '@/api/response';
import { CourseSchema } from '@/types/course';

export const courseResponseSchema = ResponseSchema(z.array(CourseSchema));
export const paginatedCourseResponseSchema = ResponseSchema(PaginatedSchema(CourseSchema));
