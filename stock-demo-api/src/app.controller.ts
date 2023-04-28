import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('companies')
  findAllCompanies(){
    return this.appService.getCompanies();
  }

  @Get('companyTS/:id')
  findTimeSeries(@Param('id') id: string) {
    return this.appService.getTimeSeries(id);
  }
}
