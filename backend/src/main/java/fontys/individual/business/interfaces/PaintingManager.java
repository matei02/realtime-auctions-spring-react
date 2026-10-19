package fontys.individual.business.interfaces;

import fontys.individual.domain.classes.Painting;

import java.util.List;

public interface PaintingManager {
    Long createPainting(Painting painting);

    void deletePainting(long id);

    Painting getPaintingById(long id);

    List<Painting> getAllPaintings();

    void updatePainting(long id, Painting painting);
}
