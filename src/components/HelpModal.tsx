import '../styles/HelpModal.css';

type HelpModalProps = {
  closeModal: () => void
};

export default function HelpModal(props: HelpModalProps) {
  const { closeModal } = props;

  return (
    <div className='modal-window-overlay'>
      <div className='modal-content'>
        <p className='modal-title'>Limitations on OpenWeatherMap</p>
        <div className='modal-text-holder'>
          <p>This React app uses the free version of OpenWeatherMap's forecast API. To keep costs and API calls low, OpenWeatherMap sends a single response that may not be as up-to-date as private weather companies.</p>
        </div>
        <div className='button-holder'>
          <button onClick={() => closeModal()}>Close</button>
        </div>
      </div>
    </div>
  );
}