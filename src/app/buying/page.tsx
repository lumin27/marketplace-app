export default function BuyingGuidePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] text-white flex flex-col items-center justify-center p-8'>
      <div className='max-w-3xl text-center'>
        <h1 className='text-3xl font-bold mb-4'>Buying Guide</h1>
        <p className='text-primary-foreground/80 mb-6 leading-relaxed'>
          Shopping through our marketplace is simple and secure. Use these tips
          to make smart purchases and avoid scams.
        </p>

        <ul className='text-left list-disc list-inside text-primary-foreground/90 space-y-3'>
          <li>
            <strong>Search smart</strong> — use filters and categories to find
            exactly what you need.
          </li>
          <li>
            <strong>Check details</strong> — read item descriptions carefully
            and view all photos.
          </li>
          <li>
            <strong>Contact the seller</strong> — ask any questions before
            buying or meeting.
          </li>
          <li>
            <strong>Meet safely</strong> — choose public, well-lit areas for
            in-person exchanges.
          </li>
          <li>
            <strong>Report suspicious activity</strong> — help keep our
            community safe by reporting anything unusual.
          </li>
        </ul>
      </div>
    </div>
  );
}
