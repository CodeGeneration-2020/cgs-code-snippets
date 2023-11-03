import {
	Body, Controller, Get, Post, Query, UseGuards,
} from '@nestjs/common'
import type {
	LocationLogs,
} from '@prisma/client'

import {
	SessionGuard,
} from '../auth/guards/session.guard'
import {
	SessionPodGuard,
} from '../auth/guards/session-pod.guard'
import {
	LocationLogService,
} from './location-log.service'
import {
	CreateLocationBatchLogDto,
    CreateLocationLogDto
} from './dto/create-log.dto'
import {
	JWTAuthGuard,
} from '../auth/guards/jwt.guard'
import {
	LocationGuard,
} from '../auth/guards/location.guard'
import {
	GetLocationLogDto,
} from './dto/get-log.dto'
import type {
	PaginatedData,
    LocationLog
} from '../../shared/types/types'

@Controller('location-log',)
export class LocationLogController {
	constructor(
		private readonly locationLogService: LocationLogService,
	) {}

	@UseGuards(SessionGuard)
	@Post('create/:id',)
	public async createNewLog(@Body() body: CreateLocationLogDto,): Promise<LocationLog> {
		return this.locationLogService.createNewLog(body,)
	}

	@UseGuards(SessionGuard, SessionPodGuard,)
	@Post('create-batch/:podId',)
	public async createNewLogBatch(@Body() body: CreateLocationBatchLogDto,): Promise<Array<LocationLogs>> {
		return this.locationLogService.createNewLogsBatch(body.logs,)
	}

	@UseGuards(JWTAuthGuard, LocationGuard,)
	@Get('list/:locationId',)
	public async getList(@Query() query: GetLocationLogDto,): Promise<PaginatedData<Array<LocationLogs>>>  {
		return this.locationLogService.getListByLogId(query,)
	}
}
