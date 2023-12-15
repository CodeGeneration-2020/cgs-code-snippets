import {
	HttpFactoryService,
} from '../../shared/services/http-factory.service'
import type {
	HttpService,
} from '../../shared/services/http.service'
import type {
	PodLoginResponse,
} from '../../shared/services/types'
import type {
	DefaultResponse,
} from '../../shared/types/types'
import type {
	AuthCheckRes,
	ILoginBody,
	LoginRes,
	PodLoginBody,
	RemoteSessionBody,
	TerminatePodSessionDto,
} from './auth.types'

class AuthService {
	constructor(private readonly httpService: HttpService,) {
		this.httpService = httpService
	}

	private readonly module = 'auth'

	public async getPodsList(body: ILoginBody,): Promise<LoginRes> {
		return this.httpService.post(`${this.module}/get-pods-list`, body,)
	}

	public async terminatePodSession(body: TerminatePodSessionDto,): Promise<unknown> {
		return this.httpService.post(`${this.module}/terminate-pod-session`, body,)
	}

	public async podLogin(body: PodLoginBody,): Promise<DefaultResponse & PodLoginResponse> {
		return this.httpService.post(`${this.module}/pod-login`, body,)
	}

	public async authCheck(): Promise<AuthCheckRes> {
		return this.httpService.get<AuthCheckRes>(`${this.module}/check`,)
	}

	public async logout(): Promise<DefaultResponse> {
		return this.httpService.get(`${this.module}/pod-logout`,)
	}

	public async remoteSessionLogout(body: RemoteSessionBody,) : Promise<DefaultResponse> {
		return this.httpService.post(`${this.module}/remote-session-logout`, body,)
	}
}

export const authService = new AuthService(new HttpFactoryService().createHttpService(),)
