import { Body, Controller, HttpCode, Logger, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUserDto';
@Controller('users')
export class UsersController {
    private logger = new Logger(UsersController.name)
  constructor(private readonly usersService: UsersService
  )
   {}

  @Patch(":id")
  @HttpCode(200)
  async updateProfile(@Param("id") id:string,@Body() dto:UpdateUserDto){
    this.logger.debug("THis is the current dto",
      dto
    )
      await this.usersService.update({
        id,dto
      })
  }
}
