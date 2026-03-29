import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919876543210?text=Hi%20Trust%20Built!%20I%20would%20like%20to%20know%20more%20about%20your%20services."
      target="_blank" rel="noopener noreferrer"
      initial={{ scale: 0 }} animate={{ scale: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
                 bg-[#25D366] flex items-center justify-center
                 shadow-[0_4px_20px_rgba(37,211,102,0.45)]
                 hover:shadow-[0_4px_30px_rgba(37,211,102,0.65)]
                 transition-shadow duration-300">
      {/* Exact WhatsApp logo SVG */}
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path
          fill="#ffffff"
          d="M16 0C7.163 0 0 7.163 0 16c0 2.833.738 5.494 2.027 7.807L0 32l8.418-2.007A15.934 15.934 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.268a13.23 13.23 0 01-6.737-1.832l-.483-.286-4.997 1.311 1.338-4.876-.315-.5A13.226 13.226 0 012.732 16C2.732 8.68 8.68 2.732 16 2.732S29.268 8.68 29.268 16 23.32 29.268 16 29.268z"
        />
        <path
          fill="#ffffff"
          d="M23.27 19.325c-.358-.179-2.118-1.044-2.446-1.163-.328-.12-.567-.179-.806.179-.238.357-.924 1.163-1.133 1.401-.208.239-.417.268-.775.09-.358-.18-1.511-.557-2.877-1.775-1.063-.949-1.78-2.121-1.989-2.479-.208-.357-.022-.55.157-.728.161-.16.358-.418.537-.627.179-.208.239-.357.358-.596.12-.238.06-.447-.03-.626-.09-.18-.806-1.94-1.104-2.657-.29-.697-.586-.602-.806-.613l-.686-.012c-.238 0-.626.09-.954.447-.328.358-1.252 1.224-1.252 2.984s1.282 3.462 1.46 3.7c.18.238 2.522 3.851 6.111 5.4.854.369 1.52.59 2.04.755.857.273 1.638.235 2.254.143.688-.102 2.118-.866 2.416-1.702.299-.836.299-1.552.21-1.702-.09-.149-.328-.238-.687-.417z"
        />
      </svg>
    </motion.a>
  );
}