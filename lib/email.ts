import nodemailer from 'nodemailer';

export async function sendResetEmail(to: string, resetToken: string) {
  // Using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // This must be an App Password, not the regular account password
    },
  });

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Nursify - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #065f46; text-align: center;">Nursify Password Reset</h2>
        <p style="color: #334155; font-size: 16px;">Hello,</p>
        <p style="color: #334155; font-size: 16px;">We received a request to reset your password. Click the button below to choose a new password. This link will expire in 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">Nursify Care Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendBookingConfirmation(to: string, bookingData: any) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Nursify - Care Request Confirmed! (#${bookingData.id.slice(-6)})`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: -0.5px;">Care Request Confirmed</h1>
          <p style="color: #d1fae5; margin-top: 10px; font-size: 16px;">We've received your request for ${bookingData.patientName}</p>
        </div>
        
        <div style="padding: 30px;">
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #0f172a; margin-top: 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Request Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Nurse Assigned</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: bold; text-align: right;">${bookingData.nurseName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Start Date</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: bold; text-align: right;">${bookingData.startDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Location</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: bold; text-align: right;">${bookingData.patientLocation}</td>
              </tr>
              <tr>
                <td style="padding: 15px 0 8px 0; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0;">Total Cost</td>
                <td style="padding: 15px 0 8px 0; color: #059669; font-size: 20px; font-weight: 800; text-align: right; border-top: 1px solid #e2e8f0;">₹${bookingData.totalCost}</td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #0f172a; margin-top: 0;">What happens next?</h3>
            <p style="color: #334155; line-height: 1.6; font-size: 15px;">
              Our administrative team is verifying the schedule. You will receive another notification once the nurse confirms the appointment. You can track the status anytime in your dashboard.
            </p>
          </div>

          <div style="text-align: center; margin-top: 35px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-dashboard" style="background-color: #0f172a; color: white; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">View Dashboard</a>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">Nursify Care - Premium Nursing at Home</p>
          <p style="color: #94a3b8; font-size: 11px; margin-top: 5px;">This is an automated message, please do not reply.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendNurseBookingNotification(to: string, bookingData: any) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Nursify - New Care Request! (#${bookingData.id.slice(-6)})`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background: #0f172a; padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Care Request</h1>
          <p style="color: #94a3b8; margin-top: 10px; font-size: 16px;">A patient has requested your nursing services.</p>
        </div>
        
        <div style="padding: 30px;">
          <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #166534; margin-top: 0;">Patient Details</h3>
            <p style="margin: 5px 0; font-size: 15px; color: #166534;"><strong>Name:</strong> ${bookingData.patientName}</p>
            <p style="margin: 5px 0; font-size: 15px; color: #166534;"><strong>Diagnosis:</strong> ${bookingData.diagnosis || 'General Care'}</p>
            <p style="margin: 5px 0; font-size: 15px; color: #166534;"><strong>Start Date:</strong> ${bookingData.startDate}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #0f172a; margin-top: 0;">Clinical Summary</h3>
            <p style="color: #334155; line-height: 1.6; font-size: 15px; background: #f8fafc; padding: 15px; border-radius: 8px; font-style: italic;">
              "${bookingData.clinicalNotes || 'No notes provided.'}"
            </p>
          </div>

          <p style="color: #ef4444; font-size: 13px; font-weight: bold;">IMPORTANT: Please review the patient's full clinical history and attached reports in your portal before confirming.</p>

          <div style="text-align: center; margin-top: 35px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-application" style="background-color: #10b981; color: white; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">Review & Accept Request</a>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendNurseStatusUpdate(to: string, nurseData: any) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const isApproved = nurseData.status === 'approved';
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Nursify - Application Status: ${isApproved ? 'Approved!' : 'Update Required'}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background: ${isApproved ? '#10b981' : '#f59e0b'}; padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Application ${isApproved ? 'Approved' : 'Updated'}</h1>
          <p style="color: white; opacity: 0.9; margin-top: 10px; font-size: 16px;">Hello ${nurseData.name}, here is an update on your profile.</p>
        </div>
        
        <div style="padding: 30px;">
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <p style="margin: 0; font-size: 16px; color: #334155; line-height: 1.6;">
              ${isApproved 
                ? 'Congratulations! Your professional profile has been verified and approved. You can now start receiving care requests from patients in your area.' 
                : 'Your application has been reviewed, and we require some additional information or corrections before we can proceed with approval.'
              }
            </p>
            
            ${nurseData.adminComments ? `
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <h4 style="color: #0f172a; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Admin Comments:</h4>
                <p style="color: #64748b; font-size: 14px; font-style: italic; margin: 0;">"${nurseData.adminComments}"</p>
              </div>
            ` : ''}
          </div>

          <div style="text-align: center; margin-top: 35px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-application" style="background-color: #0f172a; color: white; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">
              ${isApproved ? 'Go to Dashboard' : 'View Application Details'}
            </a>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">Nursify Vetting Team</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
