import {
	BadRequestException,
	Injectable,
} from '@nestjs/common'
import {
	ConfigService,
} from '@nestjs/config'
import * as postmark from 'postmark'
import {
	emailTemplate, forgotPasswordTemplate,
} from './utils/email-template.util'

@Injectable()
export class EmailService {
	private readonly client: postmark.ServerClient

	constructor(private readonly configService: ConfigService,) {
		const postmarkApiKey = this.configService.getOrThrow<string>('POSTMARK_API_KEY',)

		this.client = new postmark.ServerClient(postmarkApiKey,)
	}

	public async sendMail(to: string, subject: string, code: string,): Promise<void> {
		try {
			await this.client.sendEmail({
				From: this.configService.getOrThrow<string>('EMAIL_SENDER_ADDRESS',),
				To: to,
				Subject: subject,
				HtmlBody: emailTemplate(code,),
			},)
		} catch (error) {
			console.error('Error sending email:', error,)
			throw new BadRequestException()
		}
	}
}
