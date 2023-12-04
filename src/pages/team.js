// components/Team.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import Image from 'next/image';


const teamMembers = [
    { name: 'Benjamin Scheinberg', 
    role: 'CEO', 
    imageUrl: '/assets/Headshot.jpg', 
    twitterHandle: '@alicejohnson' },
    { name: 'Joseph Moran', 
    role: 'CTO', 
    imageUrl: '/assets/Headshot.jpg',
    twitterHandle: '@NFT69420' },
    // Add more team members here
];

const TeamMemberCard = ({ member }) => {
  return (
      <div className="bg-primary py-6 px-4 rounded-xl shadow-xl mb-6">
          <Image 
              src={member.imageUrl} 
              alt={member.name} 
              width={500} 
              height={300}
              className="w-32 h-32 rounded-full mx-auto border-4 border-secondary" 
          />
          <h3 className="font-heading text-xl text-secondary text-center mt-4">
              {member.name}
          </h3>
          <p className="text-center text-secondary font-semibold">
              {member.role}
          </p>
          <p className="text-sm text-secondary text-center mt-2">
              {member.bio}
          </p>
          {member.twitterHandle && (
              <a 
                  href={`https://twitter.com/${member.twitterHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center mt-4"
              >
                  <FontAwesomeIcon icon={faTwitter} size="1x" />
              </a>
          )}
      </div>
  );
};

const Team = () => {
    return (
        <section className="team-section">
            <h1 className="font-heading text-xl text-secondary">Our Team</h1>
            <div className="team-grid">
                {teamMembers.map(member => (
                    <TeamMemberCard key={member.name} member={member} />
                ))}
            </div>
        </section>
    );
};

export default Team;
