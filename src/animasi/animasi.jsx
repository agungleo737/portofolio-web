import kucing from '../assets/kucing1.png';

const KucingAnimasi = () => {
  return (
    <>
      <style>{`
        .wajah-petualang-cont {
          position: relative;
          height: 180px;
          width: 120px;
          overflow: hidden;
          background: transparent;
        }

        .wajah-wajah {
          position: absolute;
          top: 0;
          left: 20px;
          height: 90px;
          width: 100px;
          background-image: url(${kucing});
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          animation: kucing-jatuh 4.5s ease-in-out infinite;
        }

        @keyframes kucing-jatuh {
          0%   { transform: translate(0px, -100px); opacity: 1; }
          15%  { transform: translate(0px, 60px);    opacity: 1; }
          17%  { transform: translate(-3px, 60px); }
          19%  { transform: translate(3px, 60px); }
          21%  { transform: translate(-3px, 60px); }
          23%  { transform: translate(3px, 60px); }
          25%  { transform: translate(-3px, 60px); }
          27%  { transform: translate(3px, 60px); }
          29%  { transform: translate(-3px, 60px); }
          31%  { transform: translate(3px, 60px); }
          33%  { transform: translate(-3px, 60px); }
          35%  { transform: translate(3px, 60px); }
          37%  { transform: translate(0px, 60px); }
          55%  { transform: translate(0px, 220px); opacity: 1; }
          56%  { opacity: 0; }
          95%  { transform: translate(0px, -100px); opacity: 0; }
          100% { transform: translate(0px, -100px); opacity: 1; }
        }
      `}</style>

      <div className="wajah-petualang-cont">
        <div className="wajah-wajah"></div>
      </div>
    </>
  );
};

export default KucingAnimasi;