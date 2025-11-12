export default function ContactPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] text-white flex flex-col items-center justify-center p-8'>
      <div className='max-w-2xl text-center'>
        <h1 className='text-3xl font-bold mb-4'>Contact Us</h1>
        <p className='text-primary-foreground/80 mb-6'>
          Have questions or feedback? We’d love to hear from you. Reach out via
          email or our social channels.
        </p>
        <p className='text-primary-foreground/90'>
          📧{" "}
          <a href='mailto:support@example.com' className='underline'>
            support@example.com
          </a>
        </p>
      </div>
    </div>
  );
}
