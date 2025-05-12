import { useState } from 'react';
import { Phone, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { HeaderNumber } from '@/components/ui/headernumber';

export default function WhatsAppInput() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+62');
  const [countries, setCountries] = useState([
    { code: '+62', name: 'Indonesia (ID)', flag: '🇮🇩' },
    { code: '+1', name: 'United States (US)', flag: '🇺🇸' },
    { code: '+60', name: 'Malaysia (MY)', flag: '🇲🇾' },
    { code: '+65', name: 'Singapore (SG)', flag: '🇸🇬' },
    { code: '+61', name: 'Australia (AU)', flag: '🇦🇺' },
    { code: '+44', name: 'United Kingdom (UK)', flag: '🇬🇧' },
    { code: '+81', name: 'Japan (JP)', flag: '🇯🇵' },
    { code: '+82', name: 'South Korea (KR)', flag: '🇰🇷' },
    { code: '+66', name: 'Thailand (TH)', flag: '🇹🇭' },
    { code: '+63', name: 'Philippines (PH)', flag: '🇵🇭' },
  ]);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const handlePhoneNumberChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };
  
  const handleCountryCodeChange = (code : string) => {
    setCountryCode(code);
    setIsDropdownOpen(false);
  };
  
  return (
      <div className="flex flex-col w-full rounded-lg overflow-hidden">
          <HeaderNumber number={"4"} title="Detail Kontak" />
    
      <div className="bg-card p-4 space-y-4">
        <h2 className="text-base font-medium text-white">No. WhatsApp</h2>
        
        <div className="relative">
          <div className="flex">
            <div className="relative">
              <button
                type="button"
                className="flex items-center justify-between px-3 bg-blue-600 text-white rounded-l-md text-sm font-medium hover:bg-blue-500 h-9"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{countries.find(c => c.code === countryCode)?.flag || ''}</span>
                <span className="mx-1">{countryCode}</span>
                <span className="ml-1">▼</span>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-50 mt-1 w-64 bg-card/30  text-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      className="w-full text-left px-4 py-1 text-sm hover:bg-blue-600 flex items-center"
                      onClick={() => handleCountryCodeChange(country.code)}
                    >
                      <span className="mr-2">{country.flag}</span>
                      <span>{country.name}</span>
                      <span className="ml-1 text-gray-300">{country.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="flex-1 rounded-l-none bg-card text-white border-0 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 h-9"
              placeholder="82123456789"
            />
          </div>
          
          <div className="flex items-center mt-3 text-xs text-white italic">
            <Info className="w-3 h-3 mr-1  " />
            <span>*Nomor ini akan dihubungi jika terjadi masalah</span>
          </div>
          
          <div className="flex items-center mt-3 text-xs text-white bg-blue-500 p-2 rounded-md">
            <Phone className="w-4 h-4 mr-2  text-white" />
            <span>Jika ada kendala, kami akan menghubungi nomor WA kamu diatas</span>
          </div>
        </div>
      </div>
    </div>
  );
}