import React from 'react';

interface Province3DMiniMapProps {
  provinceKey: 'yala' | 'pattani' | 'narathiwat' | 'songkhla';
}

export const Province3DMiniMap: React.FC<Province3DMiniMapProps> = ({ provinceKey }) => {
  if (provinceKey === 'yala') {
    // ยะลา (Yala): ภูมิประเทศจริง - ไม่มีทางออกสู่ทะเล ล้อมรอบด้วยแนวเทือกเขาสันกาลาคีรี ป่าฮาลาบาลา เขื่อนบางลาง และอำเภอเบตงใต้สุดสยาม
    return (
      <div className="relative w-32 h-28 sm:w-36 sm:h-32 flex items-center justify-center select-none group">
        <svg
          viewBox="0 0 160 145"
          className="w-full h-full drop-shadow-[0_12px_22px_rgba(0,0,0,0.45)] transform transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* 3D Extrusion Bedrock / ชั้นหินฐานราก */}
            <linearGradient id="yalaRockBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#453123" />
              <stop offset="40%" stopColor="#2c1d14" />
              <stop offset="100%" stopColor="#150d09" />
            </linearGradient>

            {/* Realistic Mountainous Forest Terrain / ป่าดงดิบชื้นเขาหิน */}
            <linearGradient id="yalaRealForest" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3d6632" />
              <stop offset="35%" stopColor="#25461c" />
              <stop offset="70%" stopColor="#426b34" />
              <stop offset="100%" stopColor="#1e3617" />
            </linearGradient>

            {/* Sankalakhiri High Ridge Shading / เทือกเขาสันกาลาคีรี */}
            <linearGradient id="yalaRidgeSun" x1="0" y1="0" x2="1" y2="0.8">
              <stop offset="0%" stopColor="#7a9a54" />
              <stop offset="50%" stopColor="#537839" />
              <stop offset="100%" stopColor="#2b451d" />
            </linearGradient>

            {/* Bang Lang Reservoir Water / ผิวน้ำเขื่อนบางลางสีมรกต */}
            <linearGradient id="bangLangWater" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Betong Sea of Mist / ทะเลหมอกเบตงและอัยเยอร์เวง */}
            <radialGradient id="betongMist" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#e0f2fe" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
            </radialGradient>

            <filter id="yalaPinGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* เงาทอดภูมิประเทศ 3 มิติ */}
          <ellipse cx="80" cy="126" rx="56" ry="14" fill="rgba(15,23,42,0.4)" filter="blur(6px)" />

          {/* 3D Extruded Rock Base (แผนที่จริงทรงจังหวัดยะลา) */}
          <g transform="translate(0, 7)">
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
              fill="#18110a"
            />
            <path
              d="M 48 38 L 48 45 
                 C 54 70, 64 86, 60 110 L 60 117 
                 C 62 127, 70 133, 78 131 L 78 124 
                 C 86 112, 92 98, 96 86 L 96 93 
                 C 102 84, 105 74, 100 64 L 100 56 
                 C 104 48, 108 38, 102 30 L 102 37 Z"
              fill="url(#yalaRockBase)"
              stroke="#543c2b"
              strokeWidth="0.8"
            />
          </g>

          {/* ผิวภูมิประเทศจริงจังหวัดยะลา (Topographic Relief Surface) */}
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
            fill="url(#yalaRealForest)"
            stroke="#5d8548"
            strokeWidth="1.2"
          />

          {/* เทือกเขาสันกาลาคีรี (Sankalakhiri Ridge - สันเขาและป่าฮาลาบาลา) */}
          <path
            d="M 64 28 
               C 74 24, 88 30, 92 42 
               C 95 54, 88 66, 84 78 
               C 82 90, 78 102, 74 116 
               C 68 114, 66 102, 68 90 
               C 72 78, 68 64, 62 50 
               C 58 40, 60 32, 64 28 Z"
            fill="url(#yalaRidgeSun)"
            opacity="0.9"
          />

          {/* สันเขาป่าฮาลา-บาลา & ทิวเขาเบตง (Betong Ridge) */}
          <path
            d="M 70 86 Q 78 102 74 120 Q 67 114 69 94 Z"
            fill="#88a85c"
            opacity="0.85"
          />
          <path
            d="M 58 46 Q 66 60 64 74 Q 56 62 58 46 Z"
            fill="#80a054"
            opacity="0.75"
          />

          {/* เส้นชั้นความสูง (Topographic Contour Lines) */}
          <path
            d="M 64 34 Q 78 36 86 46 T 80 72"
            fill="none"
            stroke="#a3c47a"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            opacity="0.6"
          />
          <path
            d="M 68 76 Q 74 90 72 108"
            fill="none"
            stroke="#a3c47a"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            opacity="0.6"
          />

          {/* เขื่อนบางลาง (Bang Lang Dam & Reservoir - แหล่งน้ำจริง) */}
          <path
            d="M 74 68 C 81 64, 88 68, 86 75 C 82 82, 76 77, 74 68 Z"
            fill="url(#bangLangWater)"
            stroke="#38bdf8"
            strokeWidth="0.7"
          />
          {/* ลำน้ำสาขาเขื่อนบางลาง */}
          <path
            d="M 83 74 Q 88 78 86 85"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="0.9"
            opacity="0.85"
          />

          {/* แม่น้ำปัตตานีตอนบน (Upper Pattani River) */}
          <path
            d="M 74 24 Q 72 44 75 66"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="0.8"
            opacity="0.85"
          />

          {/* ทางหลวงยุทธศาสตร์ 410 (ยะลา - กรงปินัง - บันนังสตา - ธารโต - เบตง) */}
          <path
            d="M 73 24 Q 76 46 76 68 T 72 118"
            fill="none"
            stroke="#facc15"
            strokeWidth="0.7"
            strokeDasharray="2.5,2"
            opacity="0.8"
          />

          {/* ทะเลหมอกเบตง / อัยเยอร์เวง (Mist over Betong Valley) */}
          <ellipse cx="73" cy="114" rx="14" ry="7" fill="url(#betongMist)" pointerEvents="none" />

          {/* ป้ายภูมิประเทศ (Topographic Label) */}
          <g opacity="0.85">
            <rect x="94" y="66" width="48" height="11" rx="3" fill="rgba(15,23,42,0.7)" />
            <text x="97" y="74" fill="#38bdf8" fontSize="6.5" fontFamily="Prompt, sans-serif" fontWeight="bold">
              เขื่อนบางลาง
            </text>
          </g>
          <g opacity="0.85">
            <rect x="79" y="112" width="44" height="11" rx="3" fill="rgba(15,23,42,0.7)" />
            <text x="82" y="120" fill="#fef08a" fontSize="6.5" fontFamily="Prompt, sans-serif" fontWeight="bold">
              เบตง 1,533m
            </text>
          </g>

          {/* จุดพื้นที่ยุทธศาสตร์และความมั่นคง (Tactical GPS Pins) */}
          {/* อ.เมืองยะลา */}
          <circle cx="73" cy="24" r="2.2" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
          <text x="77" y="26" fill="#f8fafc" fontSize="6" fontFamily="Prompt, sans-serif" fontWeight="bold" opacity="0.9">
            เมืองยะลา
          </text>

          {/* อ.ยะหา */}
          <path d="M 55 42 C 53.8 42 52.5 43 52.5 44.5 C 52.5 47 55 50 55 50 C 55 50 57.5 47 57.5 44.5 C 57.5 43 56.2 42 55 42 Z" fill="#ef4444" />
          <circle cx="55" cy="44.2" r="1.1" fill="#fff" />

          {/* อ.รามัน */}
          <path d="M 94 36 C 92.8 36 91.5 37 91.5 38.5 C 91.5 41 94 44 94 44 C 94 44 96.5 41 96.5 38.5 C 96.5 37 95.2 36 94 36 Z" fill="#ef4444" />
          <circle cx="94" cy="38.2" r="1.1" fill="#fff" />

          {/* อ.บันนังสตา (จุดเฝ้าระวังสีแดง) */}
          <circle cx="78" cy="68" r="4.5" fill="#ef4444" opacity="0.35" className="animate-ping origin-center" />
          <path d="M 78 62 C 76.5 62 75 63.2 75 64.8 C 75 67.8 78 71.5 78 71.5 C 78 71.5 81 67.8 81 64.8 C 81 63.2 79.5 62 78 62 Z" fill="#dc2626" filter="url(#yalaPinGlow)" />
          <circle cx="78" cy="64.5" r="1.4" fill="#fff" />

          {/* อ.เบตง */}
          <circle cx="73" cy="118" r="4" fill="#ef4444" opacity="0.3" className="animate-ping origin-center" />
          <path d="M 73 113 C 71.8 113 70.5 114 70.5 115.5 C 70.5 118 73 121 73 121 C 73 121 75.5 118 75.5 115.5 C 75.5 114 74.2 113 73 113 Z" fill="#ef4444" />
          <circle cx="73" cy="115.2" r="1.1" fill="#fff" />
        </svg>
      </div>
    );
  }

  if (provinceKey === 'pattani') {
    // ปัตตานี (Pattani): ภูมิประเทศจริง - ที่ราบลุ่มชายฝั่งทะเลอ่าวไทย แหลมตาชีโอบล้อมอ่าวปัตตานี แม่น้ำปัตตานี และแม่น้ำสายบุรี
    return (
      <div className="relative w-32 h-28 sm:w-36 sm:h-32 flex items-center justify-center select-none group">
        <svg
          viewBox="0 0 160 145"
          className="w-full h-full drop-shadow-[0_12px_22px_rgba(0,0,0,0.45)] transform transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="ptnRockBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3d3320" />
              <stop offset="40%" stopColor="#241e12" />
              <stop offset="100%" stopColor="#120e08" />
            </linearGradient>

            {/* Coastal Plains & Alluvial Land / ที่ราบลุ่มดินดอนชายฝั่ง */}
            <linearGradient id="ptnRealPlain" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#436830" />
              <stop offset="40%" stopColor="#2f4e22" />
              <stop offset="80%" stopColor="#4a7335" />
              <stop offset="100%" stopColor="#5d8841" />
            </linearGradient>

            {/* Gulf of Thailand Satellite Ocean Gradient / อ่าวไทยสมจริง */}
            <linearGradient id="ptnGulfOcean" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="25%" stopColor="#0284c7" />
              <stop offset="60%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>

            {/* Laem Tachi Golden Sandspit / หาดทรายแหลมตาชี */}
            <linearGradient id="laemTachiSand" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>

            <filter id="ptnPinGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* เงาทอดภูมิประเทศ 3 มิติ */}
          <ellipse cx="80" cy="120" rx="56" ry="14" fill="rgba(15,23,42,0.4)" filter="blur(6px)" />

          {/* 3D Base Slab (แผ่นฐานธรณี 3 มิติทรงปัตตานี) */}
          <g transform="translate(0, 7)">
            <path
              d="M 28 62 
                 C 38 48, 54 44, 70 38 
                 C 86 34, 108 42, 126 56 
                 C 134 68, 130 84, 118 94 
                 C 102 104, 78 102, 58 96 
                 C 40 92, 24 80, 28 62 Z"
              fill="#100c06"
            />
            <path
              d="M 28 62 L 28 69 
                 C 24 87, 40 99, 58 103 L 58 96 
                 C 78 102, 102 104, 118 94 L 118 101 
                 C 130 91, 134 75, 126 63 L 126 56 Z"
              fill="url(#ptnRockBase)"
              stroke="#504229"
              strokeWidth="0.8"
            />
          </g>

          {/* ทะเลอ่าวไทยและอ่าวปัตตานี (Gulf of Thailand Coastal Waters) */}
          <path
            d="M 44 42 
               C 60 28, 86 22, 114 30 
               C 128 40, 136 52, 138 68 
               C 126 58, 112 48, 96 46 
               C 84 45, 68 46, 52 48 Z"
            fill="url(#ptnGulfOcean)"
            opacity="0.95"
          />

          {/* คลื่นชายฝั่งสีขาว (Coastal Surf Shelf) */}
          <path
            d="M 46 44 C 64 32, 90 26, 112 33 C 124 41, 132 52, 135 64"
            fill="none"
            stroke="#f0fdfa"
            strokeWidth="0.8"
            strokeDasharray="4,2"
            opacity="0.6"
          />

          {/* แหลมตาชี / แหลมโพธิ์ (Laem Tachi Sandspit Curve - สันทรายโอบอ่าวปัตตานีจริง) */}
          <path
            d="M 52 46 
               C 68 34, 88 28, 104 34 
               C 108 36, 106 40, 98 40 
               C 84 38, 68 42, 54 48 Z"
            fill="url(#laemTachiSand)"
            stroke="#eab308"
            strokeWidth="0.7"
          />

          {/* ผิวแผ่นดินจริงจังหวัดปัตตานี (Real Provincial Land Surface) */}
          <path
            d="M 28 62 
               C 38 48, 54 44, 70 42 
               C 82 43, 98 46, 112 50 
               C 124 56, 132 68, 126 80 
               C 118 94, 98 100, 80 98 
               C 62 96, 44 92, 34 82 
               C 26 74, 24 68, 28 62 Z"
            fill="url(#ptnRealPlain)"
            stroke="#5f8343"
            strokeWidth="1.2"
          />

          {/* แนวสันทรายและเนินเขาตอนใต้ (South Inward Relief) */}
          <path
            d="M 38 78 C 50 72, 66 76, 78 86 C 82 92, 68 96, 48 94 Z"
            fill="#385623"
            opacity="0.85"
          />

          {/* แม่น้ำปัตตานี (Pattani River) ไหลลงสู่อ่าวปัตตานี */}
          <path
            d="M 56 94 Q 60 76 54 50"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.4"
          />
          {/* แม่น้ำสายบุรี (Sai Buri River) ไหลออกสู่อ่าวไทย */}
          <path
            d="M 108 94 Q 112 78 120 64"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.2"
          />

          {/* ป้ายระบุภูมิประเทศ (Geographic Labels) */}
          <g opacity="0.85">
            <rect x="74" y="24" width="46" height="10" rx="3" fill="rgba(15,23,42,0.7)" />
            <text x="77" y="31.5" fill="#fef08a" fontSize="6" fontFamily="Prompt, sans-serif" fontWeight="bold">
              แหลมตาชี
            </text>
          </g>
          <g opacity="0.85">
            <rect x="42" y="34" width="40" height="10" rx="3" fill="rgba(15,23,42,0.7)" />
            <text x="45" y="41.5" fill="#38bdf8" fontSize="6" fontFamily="Prompt, sans-serif" fontWeight="bold">
              อ่าวปัตตานี
            </text>
          </g>

          {/* จุดพื้นที่เสี่ยงภัยจริง (Tactical Security Pins) */}
          {/* อ.เมืองปัตตานี */}
          <circle cx="54" cy="50" r="2.2" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
          <text x="58" y="52" fill="#f8fafc" fontSize="6" fontFamily="Prompt, sans-serif" fontWeight="bold">
            เมืองปัตตานี
          </text>

          {/* อ.หนองจิก */}
          <path d="M 40 60 C 38.8 60 37.5 61 37.5 62.5 C 37.5 65 40 68 40 68 C 40 68 42.5 65 42.5 62.5 C 42.5 61 41.2 60 40 60 Z" fill="#ef4444" />
          <circle cx="40" cy="62.2" r="1.1" fill="#fff" />

          {/* อ.โคกโพธิ์ */}
          <path d="M 34 76 C 32.8 76 31.5 77 31.5 78.5 C 31.5 81 34 84 34 84 C 34 84 36.5 81 36.5 78.5 C 36.5 77 35.2 76 34 76 Z" fill="#dc2626" />
          <circle cx="34" cy="78.2" r="1.1" fill="#fff" />

          {/* อ.ยะรัง (จุดเสี่ยงสีแดง) */}
          <circle cx="62" cy="68" r="4.5" fill="#ef4444" opacity="0.35" className="animate-ping origin-center" />
          <path d="M 62 62 C 60.5 62 59 63.2 59 64.8 C 59 67.8 62 71.5 62 71.5 C 62 71.5 65 67.8 65 64.8 C 65 63.2 63.5 62 62 62 Z" fill="#dc2626" filter="url(#ptnPinGlow)" />
          <circle cx="62" cy="64.5" r="1.3" fill="#fff" />

          {/* อ.สายบุรี */}
          <circle cx="118" cy="68" r="4.5" fill="#ef4444" opacity="0.35" className="animate-ping origin-center" />
          <path d="M 118 62 C 116.5 62 115 63.2 115 64.8 C 115 67.8 118 71.5 118 71.5 C 118 71.5 121 67.8 121 64.8 C 121 63.2 119.5 62 118 62 Z" fill="#dc2626" />
          <circle cx="118" cy="64.5" r="1.3" fill="#fff" />
        </svg>
      </div>
    );
  }

  if (provinceKey === 'narathiwat') {
    // นราธิวาส (Narathiwat): ภูมิประเทศจริง - ชายฝั่งอ่าวไทยด้านทิศตะวันออก เทือกเขาบูโด-สุไหงปาดีด้านทิศตะวันตก ป่าพรุโต๊ะแดง และแม่น้ำสุไหงโก-ลก
    return (
      <div className="relative w-32 h-28 sm:w-36 sm:h-32 flex items-center justify-center select-none group">
        <svg
          viewBox="0 0 160 145"
          className="w-full h-full drop-shadow-[0_12px_22px_rgba(0,0,0,0.45)] transform transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="nrtRockBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#352e26" />
              <stop offset="40%" stopColor="#201b15" />
              <stop offset="100%" stopColor="#0e0a07" />
            </linearGradient>

            {/* Rainforest & Peat Plain Terrain / ผืนป่าดิบชื้นและที่ราบลุ่มนราธิวาส */}
            <linearGradient id="nrtRealTerrain" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#365c2b" />
              <stop offset="35%" stopColor="#24421b" />
              <stop offset="70%" stopColor="#3c6530" />
              <stop offset="100%" stopColor="#1a3214" />
            </linearGradient>

            {/* Budo Mountain Ridge / เทือกเขาบูโด-สุไหงปาดี */}
            <linearGradient id="budoMountain" x1="0" y1="0" x2="1" y2="0.8">
              <stop offset="0%" stopColor="#6c8f49" />
              <stop offset="50%" stopColor="#496d30" />
              <stop offset="100%" stopColor="#253e18" />
            </linearGradient>

            {/* Toh Daeng Peat Swamp Forest / ป่าพรุโต๊ะแดง เอกลักษณ์นราธิวาส */}
            <radialGradient id="tohDaengPeat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#78350f" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#451a03" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#1c2f18" stopOpacity="0" />
            </radialGradient>

            {/* Gulf of Thailand Eastern Waters / ทะเลอ่าวไทยฝั่งตะวันออก */}
            <linearGradient id="nrtGulfOcean" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="35%" stopColor="#0284c7" />
              <stop offset="75%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#072a38" />
            </linearGradient>

            <filter id="nrtPinGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* เงาทอดภูมิประเทศ 3 มิติ */}
          <ellipse cx="80" cy="122" rx="56" ry="14" fill="rgba(15,23,42,0.4)" filter="blur(6px)" />

          {/* 3D Base Slab (แผ่นฐานธรณี 3 มิติทรงนราธิวาส) */}
          <g transform="translate(0, 7)">
            <path
              d="M 44 26 
                 C 64 20, 84 26, 98 38 
                 C 114 52, 128 72, 132 90 
                 C 126 104, 108 116, 88 120 
                 C 64 122, 46 112, 38 92 
                 C 32 74, 34 50, 44 26 Z"
              fill="#0e0a07"
            />
            <path
              d="M 38 92 L 38 99 
                 C 46 119, 64 129, 88 127 L 88 120 
                 C 108 116, 126 104, 132 90 L 132 97 
                 C 128 79, 114 59, 98 45 L 98 38 Z"
              fill="url(#nrtRockBase)"
              stroke="#4a3e33"
              strokeWidth="0.8"
            />
          </g>

          {/* ชายฝั่งทะเลอ่าวไทยฝั่งตะวันออก (Eastern Gulf Coast Waters) */}
          <path
            d="M 88 28 
               C 106 36, 124 54, 134 76 
               C 138 88, 134 94, 132 94 
               C 126 78, 114 62, 100 48 
               C 94 40, 88 34, 88 28 Z"
            fill="url(#nrtGulfOcean)"
            opacity="0.95"
          />

          {/* หาดทรายสีทองชายฝั่งอ่าวมะนาว-นราทัศน์ (Golden Beach Strip) */}
          <path
            d="M 90 32 C 104 42, 118 60, 128 80"
            fill="none"
            stroke="#fef08a"
            strokeWidth="1.2"
            opacity="0.85"
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
            fill="url(#nrtRealTerrain)"
            stroke="#5d8246"
            strokeWidth="1.2"
          />

          {/* เทือกเขาบูโด - สุไหงปาดี (Budo - Su-ngai Padi Mountain Ridge 1,182m) */}
          <path
            d="M 40 38 
               C 50 32, 64 36, 68 48 
               C 72 62, 66 78, 62 92 
               C 58 104, 48 106, 44 96 
               C 40 84, 42 66, 40 50 Z"
            fill="url(#budoMountain)"
            opacity="0.9"
          />

          {/* ป่าพรุโต๊ะแดง (Sirindhorn Peat Swamp Forest - ป่าพรุน้ำจืดใหญ่ที่สุดของไทย) */}
          <ellipse cx="94" cy="88" rx="15" ry="11" fill="url(#tohDaengPeat)" />

          {/* แม่น้ำสุไหงโก-ลก (Sungai Kolok Border River) พรมแดนธรรมชาติ */}
          <path
            d="M 128 82 Q 116 102 96 114"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.4"
          />
          {/* แม่น้ำบางนรา (Bang Nara River) */}
          <path
            d="M 88 34 Q 92 56 100 78"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="0.8"
            opacity="0.8"
          />

          {/* ป้ายระบุภูมิประเทศ (Geographic Labels) */}
          <g opacity="0.85">
            <rect x="26" y="32" width="46" height="10" rx="3" fill="rgba(15,23,42,0.7)" />
            <text x="29" y="39.5" fill="#fef08a" fontSize="6" fontFamily="Prompt, sans-serif" fontWeight="bold">
              เขาบูโด 1,182m
            </text>
          </g>
          <g opacity="0.85">
            <rect x="76" y="86" width="46" height="10" rx="3" fill="rgba(15,23,42,0.7)" />
            <text x="79" y="93.5" fill="#fde68a" fontSize="6" fontFamily="Prompt, sans-serif" fontWeight="bold">
              ป่าพรุโต๊ะแดง
            </text>
          </g>

          {/* จุดพื้นที่เสี่ยงภัยจริง (Tactical Security Pins) */}
          {/* อ.เมืองนราธิวาส */}
          <circle cx="88" cy="36" r="2.2" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
          <text x="92" y="38" fill="#f8fafc" fontSize="6" fontFamily="Prompt, sans-serif" fontWeight="bold">
            เมืองนราธิวาส
          </text>

          {/* อ.รือเสาะ (พื้นที่เสี่ยงสีแดงเข้ม) */}
          <circle cx="44" cy="54" r="4.5" fill="#ef4444" opacity="0.35" className="animate-ping origin-center" />
          <path d="M 44 48 C 42.5 48 41 49.2 41 50.8 C 41 53.8 44 57.5 44 57.5 C 44 57.5 47 53.8 47 50.8 C 47 49.2 45.5 48 44 48 Z" fill="#dc2626" filter="url(#nrtPinGlow)" />
          <circle cx="44" cy="50.5" r="1.3" fill="#fff" />

          {/* อ.เจาะไอร้อง */}
          <circle cx="68" cy="62" r="4" fill="#ef4444" opacity="0.3" className="animate-ping origin-center" />
          <path d="M 68 56 C 66.5 56 65 57.2 65 58.8 C 65 61.8 68 65.5 68 65.5 C 68 65.5 71 61.8 71 58.8 C 71 57.2 69.5 56 68 56 Z" fill="#ef4444" />
          <circle cx="68" cy="58.5" r="1.2" fill="#fff" />

          {/* อ.สุไหงโก-ลก (ด่านชายแดน) */}
          <path d="M 106 98 C 104.5 98 103 99.2 103 100.8 C 103 103.5 106 107 106 107 C 106 107 109 103.5 109 100.8 C 109 99.2 107.5 98 106 98 Z" fill="#ef4444" />
          <circle cx="106" cy="100.5" r="1.2" fill="#fff" />
          <text x="111" y="103" fill="#f8fafc" fontSize="5.5" fontFamily="Prompt, sans-serif" fontWeight="bold">
            โก-ลก
          </text>
        </svg>
      </div>
    );
  }

  // สงขลา (Songkhla): ภูมิประเทศจริง - ทะเลสาบสงขลาด้านบน ชายฝั่งอ่าวไทย และ 4 อำเภอความมั่นคง (จะนะ เทพา นาทวี สะบ้าย้อย) เชื่อมต่อเทือกเขาสันกาลาคีรี
  return (
    <div className="relative w-32 h-28 sm:w-36 sm:h-32 flex items-center justify-center select-none group">
      <svg
        viewBox="0 0 160 145"
        className="w-full h-full drop-shadow-[0_12px_22px_rgba(0,0,0,0.45)] transform transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="skhRockBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d2a24" />
            <stop offset="40%" stopColor="#241712" />
            <stop offset="100%" stopColor="#100806" />
          </linearGradient>

          {/* Provincial Terrain / แผ่นดินสงขลา */}
          <linearGradient id="skhRealTerrain" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#436531" />
            <stop offset="40%" stopColor="#2b471e" />
            <stop offset="80%" stopColor="#496f35" />
            <stop offset="100%" stopColor="#1f3714" />
          </linearGradient>

          {/* 4 Districts Tactical Highlight / ไฮไลท์เขต 4 อำเภอความมั่นคง */}
          <linearGradient id="skh4DistrictsGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="60%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>

          {/* Songkhla Lake & Gulf of Thailand / ทะเลสาบสงขลาและอ่าวไทย */}
          <linearGradient id="skhLakeOcean" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="35%" stopColor="#0284c7" />
            <stop offset="70%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#082c3d" />
          </linearGradient>

          <filter id="skhPinGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* เงาทอดภูมิประเทศ 3 มิติ */}
        <ellipse cx="80" cy="122" rx="56" ry="14" fill="rgba(15,23,42,0.4)" filter="blur(6px)" />

        {/* 3D Base Slab (แผ่นฐานธรณี 3 มิติทรงสงขลา) */}
        <g transform="translate(0, 7)">
          <path
            d="M 36 20 
               C 52 14, 66 24, 76 38 
               C 94 48, 118 62, 126 78 
               C 120 96, 98 114, 76 118 
               C 52 120, 36 104, 30 84 
               C 24 64, 26 40, 36 20 Z"
            fill="#100806"
          />
          <path
            d="M 30 84 L 30 91 
               C 36 111, 52 127, 76 125 L 76 118 
               C 98 114, 120 96, 126 78 L 126 85 
               C 118 69, 94 55, 76 45 L 76 38 Z"
            fill="url(#skhRockBase)"
            stroke="#5c382e"
            strokeWidth="0.8"
          />
        </g>

        {/* ทะเลสาบสงขลา (Songkhla Lake & Koh Yo - เอกลักษณ์ภูมิศาสตร์สงขลา) */}
        <path
          d="M 38 18 
             C 48 14, 58 22, 52 34 
             C 46 40, 38 34, 34 26 Z"
          fill="url(#skhLakeOcean)"
          stroke="#38bdf8"
          strokeWidth="0.8"
        />

        {/* ชายฝั่งอ่าวไทยแนวจะนะ-เทพา */}
        <path
          d="M 52 34 
             C 66 38, 86 48, 108 58 
             C 122 66, 128 76, 128 78 
             C 118 68, 100 56, 82 48 
             C 68 42, 56 38, 52 34 Z"
          fill="url(#skhLakeOcean)"
          opacity="0.9"
        />

        {/* ผิวแผ่นดินจริงจังหวัดสงขลา (Topographic Provincial Land Surface) */}
        <path
          d="M 36 20 
             C 52 16, 64 26, 74 38 
             C 90 48, 110 60, 122 74 
             C 126 84, 116 98, 96 108 
             C 80 116, 62 118, 48 110 
             C 34 100, 26 84, 28 66 
             C 26 48, 28 32, 36 20 Z"
          fill="url(#skhRealTerrain)"
          stroke="#5a7d42"
          strokeWidth="1.2"
        />

        {/* ไฮไลท์เขตพื้นที่ 4 อำเภอความมั่นคง (จะนะ, เทพา, นาทวี, สะบ้าย้อย) */}
        <path
          d="M 68 56 
             C 86 52, 104 60, 120 72 
             C 122 84, 112 96, 96 106 
             C 82 114, 70 114, 62 104 
             C 56 94, 60 76, 68 56 Z"
          fill="url(#skh4DistrictsGrad)"
          fillOpacity="0.85"
          stroke="#fca5a5"
          strokeWidth="1.1"
        />

        {/* แม่น้ำเทพา (Thepha River) */}
        <path
          d="M 98 108 Q 104 88 112 68"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.2"
        />

        {/* ป้ายระบุภูมิประเทศ (Geographic Labels) */}
        <g opacity="0.85">
          <rect x="22" y="16" width="46" height="10" rx="3" fill="rgba(15,23,42,0.7)" />
          <text x="25" y="23.5" fill="#38bdf8" fontSize="6" fontFamily="Prompt, sans-serif" fontWeight="bold">
            ทะเลสาบสงขลา
          </text>
        </g>
        <g opacity="0.85">
          <rect x="74" y="52" width="46" height="10" rx="3" fill="rgba(15,23,42,0.7)" />
          <text x="77" y="59.5" fill="#fecdd3" fontSize="6" fontFamily="Prompt, sans-serif" fontWeight="bold">
            4 อำเภอความมั่นคง
          </text>
        </g>

        {/* หาดใหญ่ (ศูนย์รวมคมนาคม) */}
        <circle cx="48" cy="58" r="2.2" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
        <text x="32" y="66" fill="#f8fafc" fontSize="5.5" fontFamily="Prompt, sans-serif" fontWeight="bold">
          หาดใหญ่
        </text>

        {/* จุดพื้นที่เสี่ยงภัยจริง 4 อำเภอความมั่นคง (Tactical GPS Pins) */}
        {/* อ.จะนะ */}
        <circle cx="80" cy="64" r="4.5" fill="#ef4444" opacity="0.35" className="animate-ping origin-center" />
        <path d="M 80 58 C 78.5 58 77 59.2 77 60.8 C 77 63.8 80 67.5 80 67.5 C 80 67.5 83 63.8 83 60.8 C 83 59.2 81.5 58 80 58 Z" fill="#ef4444" />
        <circle cx="80" cy="60.5" r="1.3" fill="#fff" />
        <text x="84" y="62" fill="#f8fafc" fontSize="5.5" fontFamily="Prompt, sans-serif" fontWeight="bold">
          จะนะ
        </text>

        {/* อ.เทพา */}
        <circle cx="106" cy="74" r="4.5" fill="#ef4444" opacity="0.35" className="animate-ping origin-center" />
        <path d="M 106 67 C 104 67 102.5 68.5 102.5 70.8 C 102.5 74 106 78 106 78 C 106 78 109.5 74 109.5 70.8 C 109.5 68.5 108 67 106 67 Z" fill="#dc2626" filter="url(#skhPinGlow)" />
        <circle cx="106" cy="70.5" r="1.5" fill="#fff" />
        <text x="110" y="72" fill="#f8fafc" fontSize="5.5" fontFamily="Prompt, sans-serif" fontWeight="bold">
          เทพา
        </text>

        {/* อ.นาทวี */}
        <path d="M 74 84 C 72.5 84 71 85.2 71 86.8 C 71 89.8 74 93.5 74 93.5 C 74 93.5 77 89.8 77 86.8 C 77 85.2 75.5 84 74 84 Z" fill="#dc2626" />
        <circle cx="74" cy="86.5" r="1.3" fill="#fff" />
        <text x="63" y="93" fill="#f8fafc" fontSize="5.5" fontFamily="Prompt, sans-serif" fontWeight="bold">
          นาทวี
        </text>

        {/* อ.สะบ้าย้อย */}
        <circle cx="90" cy="96" r="4.5" fill="#ef4444" opacity="0.35" className="animate-ping origin-center" />
        <path d="M 90 90 C 88.5 90 87 91.2 87 92.8 C 87 95.8 90 99.5 90 99.5 C 90 99.5 93 95.8 93 92.8 C 93 91.2 91.5 90 90 90 Z" fill="#dc2626" />
        <circle cx="90" cy="92.5" r="1.3" fill="#fff" />
        <text x="94" y="98" fill="#f8fafc" fontSize="5.5" fontFamily="Prompt, sans-serif" fontWeight="bold">
          สะบ้าย้อย
        </text>
      </svg>
    </div>
  );
};
