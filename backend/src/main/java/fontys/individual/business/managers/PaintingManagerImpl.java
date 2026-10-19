package fontys.individual.business.managers;

import fontys.individual.business.converters.PaintingConverter;
import fontys.individual.business.exceptions.InvalidPaintingException;
import fontys.individual.business.exceptions.NotFoundException;
import fontys.individual.business.interfaces.PaintingManager;
import fontys.individual.domain.classes.Painting;
import fontys.individual.persistence.ArtRepository;
import fontys.individual.persistence.entity.ArtEntity;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
@AllArgsConstructor
public class PaintingManagerImpl implements PaintingManager {

    private final ArtRepository artRepository;

    @Transactional
    public Long createPainting(Painting painting)
    {
        int sameDetails = 0;
        List<Painting> allPaintings = getAllPaintings();
        for (Painting p : allPaintings) {
            if ((p.getName().equals(painting.getName())))
            {
                sameDetails++;
            }
//            if (p.getPrice() == painting.getPrice())
//            {
//                sameDetails++;
//            }
            if (p.getDescription().equals(painting.getDescription()))
            {
                sameDetails++;
            }
//            if (p.getLength() == painting.getLength())
//            {
//                sameDetails++;
//            }
//            if (p.getWidth() == painting.getWidth())
//            {
//                sameDetails++;
//            }
            if (painting.getImage() != null)
            {
                if (Arrays.equals(p.getImage(), painting.getImage()))
                {
                    sameDetails++;
                }
            }
            if (sameDetails > 0)
            {
                throw new InvalidPaintingException();
            }
        }
        return artRepository.save(PaintingConverter.convertToArtEntity(painting)).getId();
    }

    @Transactional
    public void deletePainting(long id)
    {
        artRepository.deleteById(id);
    }

    @Transactional
    public Painting getPaintingById(long id)
    {
        Optional<ArtEntity> painting = artRepository.findById(id);
        if (painting.isPresent())
        {
            return PaintingConverter.convertToPainting(painting.get());
        }
        else
        {
            throw new NotFoundException();
        }
    }

    @Transactional
    public List<Painting> getAllPaintings()
    {
        List<ArtEntity> savedPaintings = artRepository.findAll();
        return savedPaintings.stream()
                .map(PaintingConverter::convertToPainting)
                .toList();
    }

    @Transactional
    public void updatePainting(long id, Painting painting)
    {
        Optional<ArtEntity> savedPainting = artRepository.findById(id);
        if (savedPainting.isPresent())
        {
            ArtEntity entity = savedPainting.get();
            entity.setName(painting.getName());
            entity.setPrice(painting.getPrice());
            entity.setWidth(painting.getWidth());
            entity.setLength(painting.getLength());
            entity.setImage(painting.getImage());
            entity.setAuction(painting.getAuction());
            entity.setSold(painting.getSold());
            artRepository.save(entity);
        }
        else
        {
            throw new NotFoundException();
        }
    }

}
