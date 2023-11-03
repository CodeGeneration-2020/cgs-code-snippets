import {
	Injectable,
	type CanActivate,
	type ExecutionContext,
} from '@nestjs/common'

import {
	PodSessionsService,
} from '../../pod-sessions/pod-sessions.service'

@Injectable()
export class SessionGuard implements CanActivate {
	constructor(@Inject(PodSessionsService,) private readonly podSessionsService: PodSessionsService,) {}

	public async canActivate(
		context: ExecutionContext,
	): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		const {
			id,
		} = request.params

		return this.podSessionsService.validateSessionPod(request.cookies['pod_session'], id,)
	}
}
