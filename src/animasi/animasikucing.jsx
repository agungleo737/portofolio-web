import paw from '../assets/paw.png';

const pawAnimasi = `
  /* jejak muncul dari kiri ke kanan, lalu memudar dan mulai lagi */
  @keyframes pawTrail {
    0%   { clip-path: inset(0 100% 0 0); opacity: 0.9; }
    55%  { clip-path: inset(0 0 0 0);    opacity: 0.9; }
    80%  { clip-path: inset(0 0 0 0);    opacity: 0.9; }
    100% { clip-path: inset(0 0 0 0);    opacity: 0; }
  }
  .paw-trail {
    background-repeat: repeat-x;
    background-position: left center;
    background-size: auto 100%;
    animation: pawTrail 5s ease-in-out infinite;
  }
`;

export default function AnimasiKucing() {
  return (
    <>
      <style>{pawAnimasi}</style>
      <div className="w-[90%] md:w-4/5 mx-auto h-14 md:h-16 overflow-hidden opacity-60">
        <div
          className="paw-trail w-full h-full"
          style={{ backgroundImage: `url(${paw})` }}
          aria-hidden="true"
        />
      </div>
    </>
  );
}
