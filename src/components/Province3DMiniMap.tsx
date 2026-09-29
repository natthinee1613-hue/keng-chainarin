import React from 'react';

interface Province3DMiniMapProps {
  provinceKey: 'yala' | 'pattani' | 'narathiwat' | 'songkhla';
}

export const Province3DMiniMap: React.FC<Province3DMiniMapProps> = ({ provinceKey }) => {
  if (provinceKey === 'yala') {
    // ยะลา (Yala): แผนที่จริง - ทรงยาวเหนือ-ใต้ มีปลายเบตงยื่นลงมาทางทิศใต้สุดของประเทศไทย เขื่อนบางลาง และแนวเทือกเขาสันกาลาคีรี
    return (
      <div className="relative w-32 h-28 sm:w-36 sm:h-32 flex items-center justify-center select-none group">
        <svg
          viewBox="0 0 160 140"
          className="w-full h-full drop-shadow-[0_14px_20px_rgba(0,0,0,0.65)] transform transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="yala3dWall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a3222" />
              <stop offset="60%" stopColor="#2b1a10" />
              <stop offset="100%" stopColor="#140a05" />
            </linearGradient>

            <linearGradient id="yalaTerrainReal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3d5e30" />
              <stop offset="35%" stopColor="#284420" />
              <stop offset="70%" stopColor="#436332" />
              <stop offset="100%" stopColor="#1f3618" />
            </linearGradient>

            <radialGradient id="yalaHighRidge" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7a9652" />
              <stop offset="60%" stopColor="#38542c" />
              <stop offset="100%" stopColor="#1f3317" />
            </radialGradient>

            <filter id="yalaRedGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ambient Ground Shadow */}
          <ellipse cx="80" cy="120" rx="55" ry="15" fill="rgba(0,0,0,0.55)" filter="blur(6px)" />

          {/* 3D Extruded Rock Base (แผนที่จริงทรงจังหวัดยะลา) */}
          <g transform="translate(0, 8)">
            <path
              d="M 68 18 
                 C 80 18, 92 22, 102 30 
                 C 108 38, 104 48, 100 56 
                 C 105 66, 102 76, 96 86 
                 C 92 98, 86 112, 78 124 
                 C 70 126, 62 120, 60 110 
                 C 66 98, 64 88, 60 76 
                 C 54 64, 46 52, 48 38 
                 C 52 26, 58 18, 68 18 Z"
              fill="#150d08"
            />
            <path
              d="M 48 38 L 48 46 
                 C 54 72, 64 86, 60 110 L 60 118 
                 C 62 128, 70 134, 78 132 L 78 124 
                 C 86 112, 92 98, 96 86 L 96 94 
                 C 102 84, 105 74, 100 64 L 100 56 
                 C 104 48, 108 38, 102 30 L 102 38 Z"
              fill="url(#yala3dWall)"
              stroke="#593b26"
              strokeWidth="0.8"
            />
          </g>

          {/* ผิวภูมิประเทศจริงจังหวัดยะลา (Real Yala Silhouette) */}
          <path
            d="M 68 18 
               C 80 18, 92 22, 102 30 
               C 108 38, 104 48, 100 56 
               C 105 66, 102 76, 96 86 
               C 92 98, 86 112, 78 124 
               C 70 126, 62 120, 60 110 
               C 66 98, 64 88, 60 76 
               C 54 64, 46 52, 48 38 
               C 52 26, 58 18, 68 18 Z"
            fill="url(#yalaTerrainReal)"
            stroke="#6c914e"
            strokeWidth="1.4"
          />

          {/* สันเขาเทือกเขาสันกาลาคีรีและป่าฮาลา-บาลา (Real Mountain Ranges) */}
          <path
            d="M 64 28 C 74 26, 88 32, 92 44 C 94 56, 88 68, 84 80 C 82 92, 78 104, 74 116 C 68 114, 66 102, 68 90 C 72 78, 68 64, 62 50 C 58 40, 60 32, 64 28 Z"
            fill="url(#yalaHighRidge)"
            opacity="0.85"
          />
          {/* สันเขาเบตงและธารโต */}
          <path
            d="M 72 88 Q 78 102 74 118 Q 68 112 70 94 Z"
            fill="#8fa366"
            opacity="0.9"
          />

          {/* เขื่อนบางลาง (Bang Lang Dam & Reservoir - แหล่งน้ำจริง) */}
          <path
            d="M 74 70 C 80 66, 86 70, 84 76 C 80 82, 76 78, 74 70 Z"
            fill="#38bdf8"
            opacity="0.9"
            stroke="#0284c7"
            strokeWidth="0.6"
          />
          <path
            d="M 82 74 Q 88 78 86 84"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="0.8"
            opacity="0.8"
          />

          {/* ทางหลวงสาย 410 (ถนนยุทธศาสตร์ ยะลา - เบตง) */}
          <path
            d="M 72 24 Q 76 46 76 68 T 72 118"
            fill="none"
            stroke="#fde047"
            strokeWidth="0.7"
            strokeDasharray="2,2"
            opacity="0.7"
          />

          {/* จุดพื้นที่เสี่ยงภัยจริง (Real High-Threat Hotspots with 3D Red Pins) */}
          {/* 1. อ.เมืองยะลา */}
          <circle cx="74" cy="26" r="2" fill="#ffffff" stroke="#1f2937" strokeWidth="0.8" />

          {/* 2. อ.ยะหา */}
          <circle cx="56" cy="46" r="4.5" fill="#ef4444" opacity="0.3" className="animate-ping origin-center" />
          <path d="M 56 40 C 54.5 40 53 41.2 53 42.8 C 53 45.8 56 49.5 56 49.5 C 56 49.5 59 45.8 59 42.8 C 59 41.2 57.5 40 56 40 Z" fill="#ef4444" />
          <circle cx="56" cy="42.5" r="1.3" fill="#fff" />

          {/* 3. อ.รามัน */}
          <path d="M 94 36 C 92.5 36 91 37.2 91 38.8 C 91 41.8 94 45.5 94 45.5 C 94 45.5 97 41.8 97 38.8 C 97 37.2 95.5 36 94 36 Z" fill="#dc2626" />
          <circle cx="94" cy="38.5" r="1.2" fill="#fff" />

          {/* 4. อ.กรงปินัง */}
          <circle cx="72" cy="52" r="4" fill="#ef4444" opacity="0.3" className="animate-ping origin-center" />
          <path d="M 72 46 C 70.8 46 69.5 47 69.5 48.5 C 69.5 51 72 54.5 72 54.5 C 72 54.5 74.5 51 74.5 48.5 C 74.5 47 73.2 46 72 46 Z" fill="#dc2626" />
          <circle cx="72" cy="48.2" r="1" fill="#fff" />

          {/* 5. อ.บันนังสตา (พื้นที่ความมั่นคงสีแดงเข้ม) */}
          <circle cx="78" cy="68" r="5.5" fill="#ef4444" opacity="0.35" className="animate-ping origin-center" />
          <path d="M 78 61 C 76 61 74.5 62.5 74.5 64.8 C 74.5 68 78 72.5 78 72.5 C 78 72.5 81.5 68 81.5 64.8 C 81.5 62.5 80 61 78 61 Z" fill="#dc2626" filter="url(#yalaRedGlow)" />
          <circle cx="78" cy="64.5" r="1.6" fill="#fff" />

          {/* 6. อ.ธารโต */}
          <path d="M 82 86 C 80.8 86 79.5 87 79.5 88.5 C 79.5 91 82 94 82 94 C 82 94 84.5 91 84.5 88.5 C 84.5 87 83.2 86 82 86 Z" fill="#ef4444" />
          <circle cx="82" cy="88.2" r="1" fill="#fff" />

          {/* 7. อ.เบตง (ใต้สุดแดนสยาม) */}
          <path d="M 74 116 C 72.5 116 71 117.2 71 118.8 C 71 121.5 74 125 74 125 C 74 125 77 121.5 77 118.8 C 77 117.2 75.5 116 74 116 Z" fill="#ef4444" />
          <circle cx="74" cy="118.5" r="1.2" fill="#fff" />
        </svg>
      </div>
    );
  }

  if (provinceKey === 'pattani') {
    // ปัตตานี (Pattani): แผนที่จริง - โค้งชายฝั่งทะเลอ่าวไทย มีแหลมตาชี/แหลมโพธิ์โอบล้อมอ่าวปัตตานี แม่น้ำปัตตานี และแนวเทือกเขา
    return (
      <div className="relative w-32 h-28 sm:w-36 sm:h-32 flex items-center justify-center select-none group">
        <svg
          viewBox="0 0 160 140"
          className="w-full h-full drop-shadow-[0_14px_20px_rgba(0,0,0,0.65)] transform transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="ptn3dWall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#453822" />
              <stop offset="60%" stopColor="#2d2212" />
              <stop offset="100%" stopColor="#140e06" />
            </linearGradient>

            <linearGradient id="ptnTerrainReal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3f5a32" />
              <stop offset="45%" stopColor="#2b4524" />
              <stop offset="85%" stopColor="#476635" />
              <stop offset="100%" stopColor="#556e3b" />
            </linearGradient>

            {/* Gulf of Thailand Realistic Water Shelf */}
            <linearGradient id="ptnRealOcean" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e8da6" />
              <stop offset="50%" stopColor="#105770" />
              <stop offset="100%" stopColor="#083045" />
            </linearGradient>

            <filter id="ptnRedGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ambient Ground Shadow */}
          <ellipse cx="80" cy="116" rx="55" ry="15" fill="rgba(0,0,0,0.55)" filter="blur(6px)" />

          {/* 3D Base Slab (แผนที่จริงทรงจังหวัดปัตตานี) */}
          <g transform="translate(0, 8)">
            <path
              d="M 28 62 
                 C 38 48, 54 44, 70 38 
                 C 86 34, 108 42, 126 56 
                 C 134 68, 130 84, 118 94 
                 C 102 104, 78 102, 58 96 
                 C 40 92, 24 80, 28 62 Z"
              fill="#120e06"
            />
            <path
              d="M 28 62 L 28 70 
                 C 24 88, 40 100, 58 104 L 58 96 
                 C 78 102, 102 104, 118 94 L 118 102 
                 C 130 92, 134 76, 126 64 L 126 56 Z"
              fill="url(#ptn3dWall)"
              stroke="#5c4a2a"
              strokeWidth="0.8"
            />
          </g>

          {/* ผืนน้ำอ่าวไทยและอ่าวปัตตานี (Gulf of Thailand & Ao Pattani) */}
          <path
            d="M 46 44 
               C 62 30, 88 24, 114 32 
               C 126 42, 134 54, 136 68 
               C 126 58, 112 48, 96 46 
               C 84 45, 68 46, 52 48 Z"
            fill="url(#ptnRealOcean)"
            opacity="0.9"
          />

          {/* แหลมตาชี / แหลมโพธิ์ (Laem Tachi Sandspit Curve - เอกลักษณ์จริงของปัตตานี) */}
          <path
            d="M 52 46 
               C 68 34, 88 28, 104 34 
               C 108 36, 106 40, 98 40 
               C 84 38, 68 42, 54 48 Z"
            fill="#dbeafe"
            stroke="#93c5fd"
            strokeWidth="0.9"
            opacity="0.95"
          />

          {/* ผิวแผ่นดินจริงจังหวัดปัตตานี (Real Pattani Provincial Silhouette) */}
          <path
            d="M 28 62 
               C 38 48, 54 44, 70 42 
               C 82 43, 98 46, 112 50 
               C 124 56, 132 68, 126 80 
               C 118 94, 98 100, 80 98 
               C 62 96, 44 92, 34 82 
               C 26 74, 24 68, 28 62 Z"
            fill="url(#ptnTerrainReal)"
            stroke="#6c8b4d"
            strokeWidth="1.4"
          />

          {/* แม่น้ำปัตตานี (Pattani River) ไหลลงสู่อ่าวปัตตานี */}
          <path
            d="M 56 94 Q 60 76 54 50"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.2"
            opacity="0.85"
          />
          {/* แม่น้ำสายบุรี (Sai Buri River) */}
          <path
            d="M 108 94 Q 112 78 120 64"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1"
            opacity="0.8"
          />

          {/* จุดพื้นที่เสี่ยงภัยจริง (Real Red Pins on High-Risk Security Locations) */}
          {/* 1. อ.เมืองปัตตานี (ปากอ่าวปัตตานี) */}
          <circle cx="54" cy="50" r="2" fill="#ffffff" stroke="#1f2937" strokeWidth="0.8" />

          {/* 2. อ.หนองจิก */}
          <path d="M 40 60 C 38.8 60 37.5 61 37.5 62.5 C 37.5 65 40 68 40 68 C 40 68 42.5 65 42.5 62.5 C 42.5 61 41.2 60 40 60 Z" fill="#ef4444" />
          <circle cx="40" cy="62.2" r="1" fill="#fff" />

          {/* 3. อ.โคกโพธิ์ */}
          <path d="M 34 76 C 32.8 76 31.5 77 31.5 78.5 C 31.5 81 34 84 34 84 C 34 84 36.5 81 36.5 78.5 C 36.5 77 35.2 76 34 76 Z" fill="#dc2626" />
          <circle cx="34" cy="78.2" r="1" fill="#fff" />

          {/* 4. อ.ยะรัง (จุดเสี่ยงสีแดง) */}
          <circle cx="62" cy="68" r="5" fill="#ef4444" opacity="0.3" className="animate-ping origin-center" />
          <path d="M 62 62 C 60.5 62 59 63.2 59 64.8 C 59 67.8 62 72 62 72 C 62 72 65 67.8 65 64.8 C 65 63.2 63.5 62 62 62 Z" fill="#dc2626" filter="url(#ptnRedGlow)" />
          <circle cx="62" cy="64.5" r="1.4" fill="#fff" />

          {/* 5. อ.มายอ */}
          <path d="M 80 74 C 78.8 74 77.5 75 77.5 76.5 C 77.5 79 80 82 80 82 C 80 82 82.5 79 82.5 76.5 C 82.5 75 81.2 74 80 74 Z" fill="#ef4444" />
          <circle cx="80" cy="76.2" r="1" fill="#fff" />

          {/* 6. อ.ยะหริ่ง */}
          <path d="M 80 54 C 78.8 54 77.5 55 77.5 56.5 C 77.5 59 80 62 80 62 C 80 62 82.5 59 82.5 56.5 C 82.5 55 81.2 54 80 54 Z" fill="#dc2626" />
          <circle cx="80" cy="56.2" r="1" fill="#fff" />

          {/* 7. อ.สายบุรี (จุดเสี่ยงริมชายฝั่ง) */}
          <circle cx="118" cy="68" r="5" fill="#ef4444" opacity="0.3" className="animate-ping origin-center" />
          <path d="M 118 62 C 116.5 62 115 63.2 115 64.8 C 115 67.8 118 72 118 72 C 118 72 121 67.8 121 64.8 C 121 63.2 119.5 62 118 62 Z" fill="#dc2626" />
          <circle cx="118" cy="64.5" r="1.4" fill="#fff" />

          {/* 8. อ.กะพ้อ */}
          <path d="M 104 88 C 102.8 88 101.5 89 101.5 90.5 C 101.5 93 104 96 104 96 C 104 96 106.5 93 106.5 90.5 C 106.5 89 105.2 88 104 88 Z" fill="#ef4444" />
          <circle cx="104" cy="90.2" r="1" fill="#fff" />
        </svg>
      </div>
    );
  }

  if (provinceKey === 'narathiwat') {
    // นราธิวาส (Narathiwat): แผนที่จริง - ชายฝั่งอ่าวไทยโค้งลงทิศตะวันออกเฉียงใต้ แนวเทือกเขาบูโด-สุไหงปาดี และแนวแม่น้ำสุไหงโก-ลก ชายแดนมาเลเซีย
    return (
      <div className="relative w-32 h-28 sm:w-36 sm:h-32 flex items-center justify-center select-none group">
        <svg
          viewBox="0 0 160 140"
          className="w-full h-full drop-shadow-[0_14px_20px_rgba(0,0,0,0.65)] transform transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="nrt3dWall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3d3731" />
              <stop offset="60%" stopColor="#24201c" />
              <stop offset="100%" stopColor="#100d0b" />
            </linearGradient>

            <linearGradient id="nrtTerrainReal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#354e30" />
              <stop offset="40%" stopColor="#253c21" />
              <stop offset="75%" stopColor="#3f5d35" />
              <stop offset="100%" stopColor="#1c2f18" />
            </linearGradient>

            <linearGradient id="nrtRealOcean" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1b8299" />
              <stop offset="60%" stopColor="#0f5166" />
              <stop offset="100%" stopColor="#072a38" />
            </linearGradient>

            <filter id="nrtRedGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ambient Ground Shadow */}
          <ellipse cx="80" cy="118" rx="55" ry="15" fill="rgba(0,0,0,0.55)" filter="blur(6px)" />

          {/* 3D Base Slab (แผนที่จริงทรงจังหวัดนราธิวาส) */}
          <g transform="translate(0, 8)">
            <path
              d="M 44 26 
                 C 64 20, 84 26, 98 38 
                 C 114 52, 128 72, 132 90 
                 C 126 104, 108 116, 88 120 
                 C 64 122, 46 112, 38 92 
                 C 32 74, 34 50, 44 26 Z"
              fill="#0e0c0a"
            />
            <path
              d="M 38 92 L 38 100 
                 C 46 120, 64 130, 88 128 L 88 120 
                 C 108 116, 126 104, 132 90 L 132 98 
                 C 128 80, 114 60, 98 46 L 98 38 Z"
              fill="url(#nrt3dWall)"
              stroke="#595046"
              strokeWidth="0.8"
            />
          </g>

          {/* ทะเลอ่าวไทยฝั่งตะวันออก (Eastern Gulf Coast Waters) */}
          <path
            d="M 88 28 
               C 106 36, 124 54, 134 76 
               C 138 88, 134 94, 132 94 
               C 126 78, 114 62, 100 48 
               C 94 40, 88 34, 88 28 Z"
            fill="url(#nrtRealOcean)"
            opacity="0.9"
          />

          {/* ผิวแผ่นดินจริงจังหวัดนราธิวาส (Real Narathiwat Provincial Silhouette) */}
          <path
            d="M 44 26 
               C 62 22, 78 26, 92 34 
               C 106 46, 120 64, 128 82 
               C 130 92, 120 102, 106 110 
               C 90 118, 72 120, 58 114 
               C 44 106, 38 90, 36 74 
               C 34 56, 36 38, 44 26 Z"
            fill="url(#nrtTerrainReal)"
            stroke="#638456"
            strokeWidth="1.4"
          />

          {/* เทือกเขาบูโด - สุไหงปาดี (Budo - Su-ngai Padi Mountain Ridge) */}
          <path
            d="M 40 38 C 50 32, 64 36, 68 48 C 72 62, 66 78, 62 92 C 58 104, 48 106, 44 96 C 40 84, 42 66, 40 50 Z"
            fill="#1f3b1c"
            opacity="0.85"
          />

          {/* แม่น้ำสุไหงโก-ลก (Sungai Kolok Border River) */}
          <path
            d="M 128 82 Q 116 102 96 114"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.3"
            opacity="0.85"
          />

          {/* จุดพื้นที่เสี่ยงภัยจริง (Real Red Pins on High-Risk Security Locations) */}
          {/* 1. อ.เมืองนราธิวาส */}
          <circle cx="88" cy="36" r="2" fill="#ffffff" stroke="#1f2937" strokeWidth="0.8" />

          {/* 2. อ.บาเจาะ */}
          <path d="M 54 32 C 52.8 32 51.5 33 51.5 34.5 C 51.5 37 54 40 54 40 C 54 40 56.5 37 56.5 34.5 C 56.5 33 55.2 32 54 32 Z" fill="#dc2626" />
          <circle cx="54" cy="34.2" r="1" fill="#fff" />

          {/* 3. อ.รือเสาะ (พื้นที่เสี่ยงสีแดงเข้ม) */}
          <circle cx="44" cy="54" r="5" fill="#ef4444" opacity="0.35" className="animate-ping origin-center" />
          <path d="M 44 48 C 42.5 48 41 49.2 41 50.8 C 41 53.8 44 58 44 58 C 44 58 47 53.8 47 50.8 C 47 49.2 45.5 48 44 48 Z" fill="#dc2626" filter="url(#nrtRedGlow)" />
          <circle cx="44" cy="50.5" r="1.4" fill="#fff" />

          {/* 4. อ.เจาะไอร้อง (จุดเกิดเหตุเส้นทางรถไฟ) */}
          <circle cx="68" cy="62" r="5" fill="#ef4444" opacity="0.3" className="animate-ping origin-center" />
          <path d="M 68 56 C 66.5 56 65 57.2 65 58.8 C 65 61.8 68 66 68 66 C 68 66 71 61.8 71 58.8 C 71 57.2 69.5 56 68 56 Z" fill="#ef4444" />
          <circle cx="68" cy="58.5" r="1.4" fill="#fff" />

          {/* 5. อ.ระแงะ */}
          <path d="M 60 76 C 58.8 76 57.5 77 57.5 78.5 C 57.5 81 60 84 60 84 C 60 84 62.5 81 62.5 78.5 C 62.5 77 61.2 76 60 76 Z" fill="#dc2626" />
          <circle cx="60" cy="78.2" r="1" fill="#fff" />

          {/* 6. อ.ตากใบ */}
          <path d="M 116 72 C 114.8 72 113.5 73 113.5 74.5 C 113.5 77 116 80 116 80 C 116 80 118.5 77 118.5 74.5 C 118.5 73 117.2 72 116 72 Z" fill="#ef4444" />
          <circle cx="116" cy="74.2" r="1" fill="#fff" />

          {/* 7. อ.สุไหงโก-ลก (ด่านชายแดน) */}
          <path d="M 106 98 C 104.5 98 103 99.2 103 100.8 C 103 103.5 106 107 106 107 C 106 107 109 103.5 109 100.8 C 109 99.2 107.5 98 106 98 Z" fill="#ef4444" />
          <circle cx="106" cy="100.5" r="1.2" fill="#fff" />

          {/* 8. อ.จะแนะ / ศรีสาคร (เทือกเขาสูง) */}
          <path d="M 52 94 C 50.8 94 49.5 95 49.5 96.5 C 49.5 99 52 102 52 102 C 52 102 54.5 99 54.5 96.5 C 54.5 95 53.2 94 52 94 Z" fill="#dc2626" />
          <circle cx="52" cy="96.2" r="1" fill="#fff" />
        </svg>
      </div>
    );
  }

  // สงขลา (Songkhla): แผนที่จริง - ทะเลสาบสงขลาด้านบน และ 4 อำเภอความมั่นคง (จะนะ เทพา นาทวี สะบ้าย้อย) เชื่อมต่อชายแดน
  return (
    <div className="relative w-32 h-28 sm:w-36 sm:h-32 flex items-center justify-center select-none group">
      <svg
        viewBox="0 0 160 140"
        className="w-full h-full drop-shadow-[0_14px_20px_rgba(0,0,0,0.65)] transform transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="skh3dWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a2820" />
            <stop offset="60%" stopColor="#2d150f" />
            <stop offset="100%" stopColor="#140704" />
          </linearGradient>

          <linearGradient id="skhTerrainReal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#445c34" />
            <stop offset="45%" stopColor="#2c4424" />
            <stop offset="80%" stopColor="#486835" />
            <stop offset="100%" stopColor="#233a1e" />
          </linearGradient>

          {/* 4 Districts Security Highlight Area Gradient */}
          <linearGradient id="skh4DistrictsGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7f1d1d" />
            <stop offset="60%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>

          <linearGradient id="skhLakeOcean" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#228ea8" />
            <stop offset="60%" stopColor="#125670" />
            <stop offset="100%" stopColor="#082c3d" />
          </linearGradient>

          <filter id="skhRedGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="80" cy="118" rx="55" ry="15" fill="rgba(0,0,0,0.55)" filter="blur(6px)" />

        {/* 3D Base Slab (แผนที่จริงทรงจังหวัดสงขลา) */}
        <g transform="translate(0, 8)">
          <path
            d="M 36 20 
               C 52 14, 66 24, 76 38 
               C 94 48, 118 62, 126 78 
               C 120 96, 98 114, 76 118 
               C 52 120, 36 104, 30 84 
               C 24 64, 26 40, 36 20 Z"
            fill="#120604"
          />
          <path
            d="M 30 84 L 30 92 
               C 36 112, 52 128, 76 126 L 76 118 
               C 98 114, 120 96, 126 78 L 126 86 
               C 118 70, 94 56, 76 46 L 76 38 Z"
            fill="url(#skh3dWall)"
            stroke="#733b2e"
            strokeWidth="0.8"
          />
        </g>

        {/* ทะเลสาบสงขลา (Songkhla Lake & Koh Yo - เอกลักษณ์แผนที่จริงของสงขลา) */}
        <path
          d="M 38 18 
             C 48 14, 58 22, 52 34 
             C 46 40, 38 34, 34 26 Z"
          fill="url(#skhLakeOcean)"
          stroke="#38bdf8"
          strokeWidth="0.8"
          opacity="0.95"
        />

        {/* ชายฝั่งอ่าวไทยแนวจะนะ-เทพา */}
        <path
          d="M 52 34 
             C 66 38, 86 48, 108 58 
             C 122 66, 128 76, 128 78 
             C 118 68, 100 56, 82 48 
             C 68 42, 56 38, 52 34 Z"
          fill="url(#skhLakeOcean)"
          opacity="0.8"
        />

        {/* ผิวแผ่นดินจริงจังหวัดสงขลา (Real Songkhla Silhouette) */}
        <path
          d="M 36 20 
             C 52 16, 64 26, 74 38 
             C 90 48, 110 60, 122 74 
             C 126 84, 116 98, 96 108 
             C 80 116, 62 118, 48 110 
             C 34 100, 26 84, 28 66 
             C 26 48, 28 32, 36 20 Z"
          fill="url(#skhTerrainReal)"
          stroke="#688a4c"
          strokeWidth="1.4"
        />

        {/* ไฮไลท์เขตพื้นที่ 4 อำเภอความมั่นคง (จะนะ, เทพา, นาทวี, สะบ้าย้อย) */}
        <path
          d="M 68 56 
             C 86 52, 104 60, 120 72 
             C 122 84, 112 96, 96 106 
             C 82 114, 70 114, 62 104 
             C 56 94, 60 76, 68 56 Z"
          fill="url(#skh4DistrictsGrad)"
          fillOpacity="0.88"
          stroke="#fca5a5"
          strokeWidth="1.2"
        />

        {/* หาดใหญ่ (ศูนย์เชื่อมต่อระบบเศรษฐกิจ) */}
        <circle cx="48" cy="58" r="2.2" fill="#ffffff" stroke="#1f2937" strokeWidth="0.8" />

        {/* จุดพื้นที่เสี่ยงภัยจริง 4 อำเภอความมั่นคง (3D Red Threat Pins) */}
        {/* 1. อ.จะนะ (สภ.จะนะ / สะพานคลองนาทับ) */}
        <circle cx="80" cy="62" r="5" fill="#ef4444" opacity="0.3" className="animate-ping origin-center" />
        <path d="M 80 56 C 78.5 56 77 57.2 77 58.8 C 77 61.8 80 66 80 66 C 80 66 83 61.8 83 58.8 C 83 57.2 81.5 56 80 56 Z" fill="#ef4444" />
        <circle cx="80" cy="58.5" r="1.4" fill="#fff" />

        {/* 2. อ.เทพา (สภ.เทพา / สภ.ห้วยปลิง ริมชายแดนปัตตานี) */}
        <circle cx="106" cy="72" r="5.5" fill="#ef4444" opacity="0.35" className="animate-ping origin-center" />
        <path d="M 106 65 C 104 65 102.5 66.5 102.5 68.8 C 102.5 72 106 76.5 106 76.5 C 106 76.5 109.5 72 109.5 68.8 C 109.5 66.5 108 65 106 65 Z" fill="#dc2626" filter="url(#skhRedGlow)" />
        <circle cx="106" cy="68.5" r="1.6" fill="#fff" />

        {/* 3. อ.นาทวี (สภ.นาทวี / สภ.สะท้อน) */}
        <path d="M 74 84 C 72.5 84 71 85.2 71 86.8 C 71 89.8 74 94 74 94 C 74 94 77 89.8 77 86.8 C 77 85.2 75.5 84 74 84 Z" fill="#dc2626" />
        <circle cx="74" cy="86.5" r="1.3" fill="#fff" />

        {/* 4. อ.สะบ้าย้อย (สภ.สะบ้าย้อย / สภ.บ้านโหนด รอยต่อยะลา) */}
        <circle cx="90" cy="96" r="5" fill="#ef4444" opacity="0.3" className="animate-ping origin-center" />
        <path d="M 90 90 C 88.5 90 87 91.2 87 92.8 C 87 95.8 90 100 90 100 C 90 100 93 95.8 93 92.8 C 93 91.2 91.5 90 90 90 Z" fill="#dc2626" />
        <circle cx="90" cy="92.5" r="1.4" fill="#fff" />

        {/* 5. สภ.ลำไพล (จุดตรวจความมั่นคงสำคัญ) */}
        <path d="M 88 80 C 86.8 80 85.5 81 85.5 82.5 C 85.5 85 88 88 88 88 C 88 88 90.5 85 90.5 82.5 C 90.5 81 89.2 80 88 80 Z" fill="#ef4444" />
        <circle cx="88" cy="82.2" r="1" fill="#fff" />
      </svg>
    </div>
  );
};
