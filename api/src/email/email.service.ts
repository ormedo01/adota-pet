import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    async sendStatusUpdateEmail(to: string, petName: string, status: string) {
        // In a real application, you would use a library like nodemailer or SendGrid here
        // For now, we'll just log the email content
        const statusText = status === 'approved'
            ? 'APROVADA! 🎉 Entre em contato com a ONG para os próximos passos.'
            : status === 'rejected'
                ? 'infelizmente rejeitada neste momento.'
                : `atualizada para: ${status}`;

        this.logger.log(`
      -------------------------------------------------------------
      [MOCK EMAIL SERVICE] Sending email to: ${to}
      Subject: Atualização na sua candidatura para adotar ${petName}
      
      Olá!
      
      Gostaríamos de informar que sua candidatura para adotar o pet ${petName} foi ${statusText}
      
      Acesse o painel para mais detalhes: https://adota-pet.vercel.app/
      -------------------------------------------------------------
    `);

        return true;
    }
}
