import {Controller, Get, Put, Body, Request, UseGuards, Post} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('sync')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async syncUser(@Request() req) {
        return this.usersService.syncUser(req.user.sub, req.body.email);
    }

    @Put('email')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async updateEmail(@Request() req, @Body() body: { email: string }) {
        return this.usersService.updateEmail(req.user.sub, body.email);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getProfile(@Request() req) {
        return this.usersService.getUserProfile(
            req.user.sub,
            req.user.realm_access.roles,
        );
    }
}