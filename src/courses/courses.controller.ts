import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import Course from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import Review from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ObjectID } from 'mongodb';
import {PaseObjectIdPipe} from '../common/pipes'

// เป็นคลาสที่ให้บริการ resource ต่าง ๆ
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  async findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    if (
      createCourseDto.number !== undefined &&
      createCourseDto.title != undefined
    ) {
      const newCourse = this.coursesService.create(createCourseDto);
      return newCourse;
    } else {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':courseId/reviews')
  async findAllReviews(
    @Param('courseId', PaseObjectIdPipe) courseId: ObjectID,
  ): Promise<Review[]> {
    return this.coursesService.findAllReviews(courseId);
  }

  @Post(':courseId/reviews')
  async createReview(
    @Param('courseId') courseId: ObjectID,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    if (
      createReviewDto.comment !== undefined &&
      createReviewDto.score != undefined
    ) {
      createReviewDto.courseId = courseId;
      const newReview = this.coursesService.createReview(createReviewDto);
      return newReview;
    } else {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
